import { meta } from '@extension/shared';
/**
 * 类型定义
 */
export interface AssetData {
  artist_link: string;
  attribution: string;
  attribution_link: string;
  creator: string;
  image: string;
  link: string;
  source: string;
  title: string;
  data_url?: string;
}

type CacheType = 'all' | 'images' | 'metadata';

/**
 * 常量配置
 */
const DB_CONFIG = {
  name: 'gac_extension_db',
  version: 1,
  stores: {
    images: 'images',
    metadata: 'metadata',
  },
} as const;

const API_CONFIG = {
  jsonUrl: 'https://www.gstatic.com/culturalinstitute/tabext/imax_2_2.json',
  baseUrl: 'https://artsandculture.google.com/',
  imageSize: '=s1920-rw',
  metadataExpiry: 5 * 60 * 1000,
  preloadCount: 10,
} as const;

const MEMORY_CACHE_SIZE = 5;

const STORAGE_KEYS = {
  cacheTimestamp: 'json_cache_timestamp',
  currentIndex: 'current_image_index',
  assetList: 'asset_list',
} as const;

/**
 * 数据库操作
 */
let dbInstance: IDBDatabase | null = null;

async function getDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.images)) {
        db.createObjectStore(DB_CONFIG.stores.images);
      }
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.metadata)) {
        db.createObjectStore(DB_CONFIG.stores.metadata);
      }
    };
  });
}

async function dbRead<T>(storeName: string, key: string): Promise<T | null> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function dbWrite(storeName: string, key: string, value: any): Promise<void> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function dbClear(storeName: string): Promise<void> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function composeLink(link: string): string {
  return link.startsWith('http') ? link : `${API_CONFIG.baseUrl}${link}`;
}

/**
 * 核心功能函数
 */
async function loadImageDataUrl(imageUrl: string): Promise<string> {
  const cachedDataUrl = await dbRead<string>(DB_CONFIG.stores.images, imageUrl);
  if (cachedDataUrl) return cachedDataUrl;

  const response = await fetch(imageUrl, {
    method: 'GET',
    headers: {
      Accept: 'image/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();
  const dataUrl = await blobToDataUrl(blob);
  await dbWrite(DB_CONFIG.stores.images, imageUrl, dataUrl);

  return dataUrl;
}

// 添加全局的 syncDataPromise
let syncDataPromise: Promise<void> | null = null;

/**
 * 同步资源数据
 * 如果有缓存，立即返回并在需要时后台更新
 * 如果没有缓存，同步获取新数据
 */
export async function syncData(): Promise<void> {
  // 如果已经在同步中，直接返回已存在的 Promise
  if (syncDataPromise) {
    return syncDataPromise;
  }
  syncDataPromise = (async () => {
    const currentAssets = await dbRead<AssetData[]>(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList);

    // 如果有缓存
    if (currentAssets && currentAssets.length > 0) {
      // do nothing
    } else {
      await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList, meta);
    }
  })();
  return syncDataPromise;
}

/**
 * 获取资源列表
 */
async function getAssetList(): Promise<AssetData[]> {
  // 先尝试从缓存获取
  const assets = await dbRead<AssetData[]>(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList);
  if (assets && assets.length > 0) {
    return assets;
  }

  // 如果没有缓存数据，执行同步
  await syncData();

  // 再次尝试获取
  const updatedAssets = await dbRead<AssetData[]>(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList);
  if (!updatedAssets || updatedAssets.length === 0) {
    throw new Error('Failed to get assets data');
  }

  return updatedAssets;
}

// 内存缓存相关
const memoryCache: Map<string, string> = new Map();

// 添加全局的 preloadPromise
let preloadPromise: Promise<void> | null = null;

// 预加载图片
export async function preloadImages(currentIndex: number): Promise<void> {
  // 如果已经在预加载中，返回现有的 Promise
  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = (async () => {
    const promises: Promise<void>[] = [];

    for (let i = 1; i <= API_CONFIG.preloadCount; i++) {
      const index = (currentIndex + i) % meta.length;
      const imageUrl = meta[index].image;

      // 如果已经在内存缓存中，跳过
      if (memoryCache.has(imageUrl)) {
        continue;
      }

      promises.push(
        loadImageDataUrl(imageUrl)
          .then(dataUrl => {
            // 添加到内存缓存
            memoryCache.set(imageUrl, dataUrl);
            // 如果缓存太大，删除最旧的
            if (memoryCache.size > MEMORY_CACHE_SIZE) {
              const firstKey = memoryCache.keys().next().value;
              memoryCache.delete(firstKey);
            }
          })
          .catch(error => {
            console.error(`Failed to preload image at index ${index}:`, error);
          }),
      );
    }

    await Promise.allSettled(promises);
    preloadPromise = null;
  })();

  return preloadPromise;
}

// 修改 getImage 函数，优先从内存缓存获取
export async function getImage(index: number): Promise<AssetData> {
  const assets = await getAssetList();
  if (index < 0 || index >= assets.length) {
    throw new Error(`Invalid index: ${index}`);
  }

  // 先检查内存缓存
  const cachedImage = memoryCache.get(index);
  if (cachedImage) {
    return cachedImage.asset;
  }

  const asset = assets[index];
  const imageUrl = `${asset.image}`;
  const dataUrl = await loadImageDataUrl(imageUrl);

  const processedAsset = {
    ...asset,
    data_url: dataUrl,
    artist_link: composeLink(asset.artist_link),
    attribution_link: composeLink(asset.attribution_link),
    link: composeLink(asset.link),
  };

  // 添加到内存缓存
  updateMemoryCache(index, processedAsset);

  return processedAsset;
}

// 添加更新内存缓存的函数
function updateMemoryCache(currentIndex: number, asset: AssetData) {
  // 添加当前图片到缓存
  memoryCache.set(currentIndex, { index: currentIndex, asset });

  // 如果缓存超出大小限制，删除最旧的条目
  if (memoryCache.size > MEMORY_CACHE_SIZE) {
    // 找到最远的索引
    const indices = Array.from(memoryCache.keys());
    const furthestIndex = indices.reduce((a, b) => (Math.abs(b - currentIndex) > Math.abs(a - currentIndex) ? b : a));
    memoryCache.delete(furthestIndex);
  }
}

// 修改 getImageDataUrl 函数，使用缓存
export async function getImageDataUrl(imageUrl: string): Promise<string> {
  // 先检查内存缓存
  const cachedDataUrl = memoryCache.get(imageUrl);
  if (cachedDataUrl) {
    return cachedDataUrl;
  }

  // 再检查 IndexedDB 缓存
  const cachedData = await dbRead<string>(DB_CONFIG.stores.images, imageUrl);
  if (cachedData) {
    // 添加到内存缓存
    memoryCache.set(imageUrl, cachedData);
    return cachedData;
  }

  // 如果都没有，则加载并缓存
  const dataUrl = await loadImageDataUrl(imageUrl);

  // 保存到内存
  memoryCache.set(imageUrl, dataUrl);

  return dataUrl;
}

// 获取/设置当前索引
export async function getCurrentIndex(): Promise<number> {
  const index = await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex);
  return index ? parseInt(index) : 0;
}

// 修改 setCurrentIndex 函数，添加预加载
export async function setCurrentIndex(index: number): Promise<void> {
  await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex, index.toString());
  // 触发预加载
  preloadImages(index).catch(console.error);
}

// 修改 clearCache 函数，同时清除内存缓存
export async function clearCache(type: CacheType = 'all'): Promise<void> {
  if (type === 'all' || type === 'images') {
    await dbClear(DB_CONFIG.stores.images);
    memoryCache.clear(); // 清除内存缓存
  }
  if (type === 'all' || type === 'metadata') {
    await dbClear(DB_CONFIG.stores.metadata);
  }
}

// 获取当前片
export async function getCurrentImage(): Promise<AssetData> {
  const currentIndex = await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex);
  const index = currentIndex ? parseInt(currentIndex) : 0;
  return getImage(index);
}

// 导出测试用配置
export const TEST_ONLY = {
  DB_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
};
