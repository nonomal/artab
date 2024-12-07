import 'webextension-polyfill';
import { syncData, getImage, getNextImage, getPreviousImage, getCurrentImage } from '../services/asset';

// 每次启动时同步数据
syncData().catch(error => {
  console.error('Failed to sync art data:', error);
});

// 监听安装事件
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // 新安装时打开新标签页
    chrome.tabs.create({
      url: chrome.runtime.getURL('new-tab/index.html'),
    });
  }
});

// 处理来自新标签页的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      switch (request.type) {
        case 'GET_INITIAL_IMAGE':
          return await getCurrentImage();
        case 'GET_NEXT_IMAGE':
          console.log('GET_NEXT_IMAGE');
          return await getNextImage();
        case 'GET_PREVIOUS_IMAGE':
          return await getPreviousImage();
        default:
          throw new Error('Unknown request type');
      }
    } catch (error) {
      console.error('Error handling request:', error);
      throw error;
    }
  };

  // 使用这种方式来处理异步响应
  handleRequest()
    .then(response => sendResponse({ success: true, data: response }))
    .catch(error => sendResponse({ success: false, error: error.message }));

  return true; // 保持消息通道打开以进行异步响应
});

// 添加扩展图标点击事件监听器
chrome.action.onClicked.addListener(() => {
  // 点击扩展图标时打开新标签页
  chrome.tabs.create({
    url: chrome.runtime.getURL('new-tab/index.html'),
  });
});

console.log('background loaded');
