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
  metadataExpiry: 24 * 60 * 60 * 1000,
  preloadCount: 5,
} as const;

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

/**
 * 工具函数
 */
function isMetadataExpired(timestamp: string | null): boolean {
  if (!timestamp) return true;
  const cacheTime = Number(timestamp);
  return isNaN(cacheTime) || Date.now() - cacheTime > API_CONFIG.metadataExpiry;
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
    headers: { Accept: 'image/*' },
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
 */
export async function syncData(): Promise<void> {
  // 如果已经在同步中，直接返回已存在的 Promise
  if (syncDataPromise) {
    return syncDataPromise;
  }

  syncDataPromise = (async () => {
    try {
      const timestamp = await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.cacheTimestamp);
      const currentAssets = await dbRead<AssetData[]>(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList);

      if (isMetadataExpired(timestamp) || !currentAssets) {
        const response = await fetch(API_CONFIG.jsonUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const assets = await response.json();
        await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.assetList, assets);
        await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.cacheTimestamp, Date.now().toString());
      }
    } finally {
      syncDataPromise = null;
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

export async function getImage(index: number): Promise<AssetData> {
  const assets = await getAssetList();
  if (index < 0 || index >= assets.length) {
    throw new Error(`Invalid index: ${index}`);
  }

  const asset = assets[index];
  const imageUrl = `${asset.image}${API_CONFIG.imageSize}`;
  const dataUrl = await loadImageDataUrl(imageUrl);

  return {
    ...asset,
    data_url: dataUrl,
    artist_link: composeLink(asset.artist_link),
    attribution_link: composeLink(asset.attribution_link),
    link: composeLink(asset.link),
  };
}

export async function getNextImage(): Promise<AssetData> {
  const assets = await getAssetList();
  const currentIndex = (await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex)) || '-1';
  const nextIndex = (Number(currentIndex) + 1) % assets.length;

  await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex, nextIndex.toString());

  // 异步预加载下一批图片
  preloadImages(nextIndex).catch(console.error);

  return getImage(nextIndex);
}

export async function getPreviousImage(): Promise<AssetData> {
  const assets = await getAssetList();
  const currentIndex = (await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex)) || '0';
  const prevIndex = (((Number(currentIndex) - 1) % assets.length) + assets.length) % assets.length;

  await dbWrite(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex, prevIndex.toString());
  return getImage(prevIndex);
}

export async function clearCache(type: CacheType = 'all'): Promise<void> {
  if (type === 'all' || type === 'images') {
    await dbClear(DB_CONFIG.stores.images);
  }
  if (type === 'all' || type === 'metadata') {
    await dbClear(DB_CONFIG.stores.metadata);
  }
}

async function preloadImages(currentIndex: number): Promise<void> {
  const assets = await getAssetList();
  const promises: Promise<void>[] = [];

  for (let i = 1; i <= API_CONFIG.preloadCount; i++) {
    const index = (currentIndex + i) % assets.length;
    const asset = assets[index];
    const imageUrl = `${asset.image}${API_CONFIG.imageSize}`;

    promises.push(
      loadImageDataUrl(imageUrl).catch(error => {
        console.error(`Failed to preload image at index ${index}:`, error);
      }),
    );
  }

  await Promise.allSettled(promises);
}

// 导出测试用配置
export const TEST_ONLY = {
  DB_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
};
