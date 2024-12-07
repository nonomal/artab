/**
 * 自定义错误类型
 */
class AssetError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'AssetError';
  }
}

/**
 * 艺术品数据接口定义
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

/**
 * 数据库配置
 */
const DB_CONFIG = {
  name: 'gac_extension_db',
  version: 1,
  stores: {
    images: 'images',
    metadata: 'metadata',
  },
} as const;

/**
 * API配置
 */
const API_CONFIG = {
  jsonUrl: 'https://www.gstatic.com/culturalinstitute/tabext/imax_2_2.json',
  baseUrl: 'https://artsandculture.google.com/',
  imageSize: '=s1920-rw',
  metadataExpiry: 24 * 60 * 60 * 1000, // 元数据24小时过期
  preloadCount: 5,
} as const;

/**
 * 存储键名
 */
const STORAGE_KEYS = {
  cacheTimestamp: 'json_cache_timestamp',
  currentIndex: 'current_image_index',
} as const;

/**
 * 数据库管理类
 */
class DatabaseManager {
  private static instance: DatabaseManager;
  private db: IDBDatabase | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async getDatabase(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    try {
      this.db = await this.initDatabase();
      return this.db;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AssetError(`Failed to initialize database: ${errorMessage}`, 'DB_INIT_ERROR');
    }
  }

  private initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

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

  async read<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async write(storeName: string, key: string, value: any): Promise<void> {
    const db = await this.getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * 资源管理类
 */
class AssetManager {
  private static instance: AssetManager;
  private db: DatabaseManager;
  private assets: readonly AssetData[] = [];
  private syncPromise: Promise<void> | null = null;

  private constructor() {
    this.db = DatabaseManager.getInstance();
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * 同步资源元数据
   */
  async syncData(): Promise<void> {
    if (this.syncPromise) return this.syncPromise;

    this.syncPromise = (async () => {
      try {
        // 检查元数据是否过期
        const timestamp = await this.db.read<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.cacheTimestamp);
        console.log('timestamp', timestamp);
        // also check if assets is empty
        const cachedAssets = await this.db.read<AssetData[]>(DB_CONFIG.stores.metadata, 'assets');
        const isAssetsEmpty = !cachedAssets || cachedAssets.length === 0;

        if (this.isMetadataExpired(timestamp) || isAssetsEmpty) {
          const response = await fetch(API_CONFIG.jsonUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });

          if (!response.ok) {
            throw new AssetError(`Failed to fetch data: ${response.statusText}`, 'FETCH_ERROR');
          }

          this.assets = await response.json();
          console.log('this.assets', this.assets);
          await this.db.write(DB_CONFIG.stores.metadata, STORAGE_KEYS.cacheTimestamp, Date.now().toString());
        }
      } finally {
        this.syncPromise = null;
      }
    })();

    return this.syncPromise;
  }

  /**
   * 清除所有缓存
   * @param type 'all' | 'images' | 'metadata' 默认为 'all'
   */
  async clearCache(type: 'all' | 'images' | 'metadata' = 'all'): Promise<void> {
    if (type === 'all' || type === 'images') {
      await this.db.clear(DB_CONFIG.stores.images);
      // 清除内存中的data_url
      this.assets = this.assets.map(asset => ({
        ...asset,
        data_url: undefined,
      }));
    }
    if (type === 'all' || type === 'metadata') {
      await this.db.clear(DB_CONFIG.stores.metadata);
      this.assets = [];
    }
  }

  /**
   * 预加载指定范围的图片
   */
  async preloadImages(currentIndex: number): Promise<void> {
    const startIndex = currentIndex;
    const endIndex = startIndex + API_CONFIG.preloadCount;
    console.log('startIndex', startIndex, endIndex);
    const promises: Promise<void>[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      const index = ((i % this.assets.length) + this.assets.length) % this.assets.length;
      promises.push(this.ensureImageLoaded(index));
    }

    // 使用 Promise.allSettled 确保部分失败不影响整体
    await Promise.allSettled(promises);
  }

  /**
   * 确保单个图片已加载
   */
  private async ensureImageLoaded(index: number): Promise<void> {
    if (this.assets[index].data_url) return;

    const asset = this.assets[index];
    const imageUrl = `${asset.image}${API_CONFIG.imageSize}`;

    try {
      // 先检查缓存
      const cachedDataUrl = await this.db.read<string>(DB_CONFIG.stores.images, imageUrl);

      if (cachedDataUrl) {
        this.assets = this.assets.map((item, i) => (i === index ? { ...item, data_url: cachedDataUrl } : item));
        return;
      }

      // 如果没有缓存，则获取图片
      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: { Accept: 'image/*' },
      });

      if (!response.ok) {
        throw new AssetError(`Failed to fetch image: ${response.statusText}`, 'IMAGE_FETCH_ERROR');
      }

      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);

      // 永久缓存图片
      await this.db.write(DB_CONFIG.stores.images, imageUrl, dataUrl);

      this.assets = this.assets.map((item, i) => (i === index ? { ...item, data_url: dataUrl } : item));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AssetError(`Failed to load image: ${errorMessage}`, 'IMAGE_LOAD_ERROR');
    }
  }

  /**
   * 获取图片资源
   */
  async getImage(index: number): Promise<AssetData> {
    console.log('index', index);
    index = 233;
    if (this.assets.length === 0) {
      await this.syncData();
    }

    if (index < 0 || index >= this.assets.length) {
      throw new AssetError(`Invalid index: ${index}`, 'INVALID_INDEX');
    }

    const asset = this.assets[index];
    console.log('asset', asset);

    if (!asset.data_url) {
      await this.loadImage(index);
    }

    return {
      ...asset,
      artist_link: this.composeLink(asset.artist_link),
      attribution_link: this.composeLink(asset.attribution_link),
      link: this.composeLink(asset.link),
    };
  }

  /**
   * 获取下一张图片
   */
  async getNextImage(): Promise<AssetData> {
    const currentIndex = await this.getCurrentIndex();
    console.log('currentIndex', currentIndex);
    console.log('this.assets', this.assets);
    let nextIndex = 0;
    if (this.assets.length > 0) {
      nextIndex = (currentIndex + 1) % this.assets.length;
    }
    console.log('nextIndex', nextIndex);
    await this.setCurrentIndex(nextIndex);

    // 预加载下一批图片
    this.preloadImages(nextIndex).catch(error => {
      console.error('Preload failed:', error);
    });

    return this.getImage(nextIndex);
  }

  /**
   * 获取上一张图片
   */
  async getPreviousImage(): Promise<AssetData> {
    console.log('getPreviousImage');
    const currentIndex = await this.getCurrentIndex();
    console.log('currentIndex', currentIndex);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    await this.setCurrentIndex(prevIndex);
    return this.getImage(prevIndex);
  }

  private async getCurrentIndex(): Promise<number> {
    const stored = await this.db.read<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex);
    let final = stored ? Number(stored) : -1;
    // check is valid
    if (final >= -1) {
      return final;
    } else {
      // reset to 0
      await this.setCurrentIndex(-1);
      return -1;
    }
  }

  private async setCurrentIndex(index: number): Promise<void> {
    await this.db.write(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex, index.toString());
  }

  private async loadImage(index: number): Promise<void> {
    const asset = this.assets[index];
    const imageUrl = `${asset.image}${API_CONFIG.imageSize}`;

    try {
      const cachedDataUrl = await this.db.read<string>(DB_CONFIG.stores.images, imageUrl);

      if (cachedDataUrl) {
        this.assets = this.assets.map((item, i) => (i === index ? { ...item, data_url: cachedDataUrl } : item));
        return;
      }

      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: { Accept: 'image/*' },
      });

      if (!response.ok) {
        throw new AssetError(`Failed to fetch image: ${response.statusText}`, 'IMAGE_FETCH_ERROR');
      }

      const blob = await response.blob();
      const dataUrl = await this.blobToDataUrl(blob);

      await this.db.write(DB_CONFIG.stores.images, imageUrl, dataUrl);
      this.assets = this.assets.map((item, i) => (i === index ? { ...item, data_url: dataUrl } : item));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AssetError(`Failed to load image: ${errorMessage}`, 'IMAGE_LOAD_ERROR');
    }
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private composeLink(link: string): string {
    return link.startsWith('http') ? link : `${API_CONFIG.baseUrl}${link}`;
  }

  private isMetadataExpired(timestamp: string | null): boolean {
    if (!timestamp) return true;
    const cacheTime = Number(timestamp);
    return isNaN(cacheTime) || Date.now() - cacheTime > API_CONFIG.metadataExpiry;
  }
}

const assetManager = AssetManager.getInstance();

// 修改导出方式，确保方法绑定到实例
export const syncData = assetManager.syncData.bind(assetManager);
export const getImage = assetManager.getImage.bind(assetManager);
export const getNextImage = assetManager.getNextImage.bind(assetManager);
export const getPreviousImage = assetManager.getPreviousImage.bind(assetManager);
export const clearCache = assetManager.clearCache.bind(assetManager);

// 导出测试工具
export const TEST_ONLY = {
  DB_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  AssetManager,
  DatabaseManager,
};
