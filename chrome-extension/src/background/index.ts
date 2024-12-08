import 'webextension-polyfill';
import { getImageDataUrl, getCurrentIndex, setCurrentIndex, preloadImages } from '../services/asset';

// 处理消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      switch (request.type) {
        case 'GET_IMAGE_DATA_URL':
          return await getImageDataUrl(request.imageUrl);
        case 'GET_CURRENT_INDEX':
          return await getCurrentIndex();
        case 'SET_CURRENT_INDEX':
          await setCurrentIndex(request.index);
          return true;
        default:
          throw new Error('Unknown request type');
      }
    } catch (error) {
      console.error('Error handling request:', error);
      throw error;
    }
  };

  handleRequest()
    .then(response => sendResponse({ success: true, data: response }))
    .catch(error => sendResponse({ success: false, error: error.message }));

  return true;
});

// 添加扩展图标点击事件监听器
chrome.action.onClicked.addListener(() => {
  // 点击扩展图标时打开新标签页
  chrome.tabs.create({
    url: chrome.runtime.getURL('new-tab/index.html'),
  });
});

// 在扩展启动和安装时预加载图片
chrome.runtime.onStartup.addListener(async () => {
  const currentIndex = await getCurrentIndex();
  preloadImages(currentIndex);
});

chrome.runtime.onInstalled.addListener(async () => {
  const currentIndex = await getCurrentIndex();
  preloadImages(currentIndex);
});

console.log('background loaded');
