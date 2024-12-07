import 'webextension-polyfill';
import { syncData, getImage, getNextImage, getPreviousImage } from '../services/asset';

// 在扩展启动时同步数据
syncData().catch(error => {
  console.error('Failed to sync art data:', error);
});

// 每24小时同步一次数据
// 这里肯定不会执行，因为后台进程会被杀死

chrome.alarms.create('syncData', { periodInMinutes: 12 * 60 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'syncData') {
    syncData().catch(error => {
      console.error('Failed to sync art data:', error);
    });
  }
});

// 处理来自新标签页的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      switch (request.type) {
        case 'GET_INITIAL_IMAGE':
          const image = await getImage(0);
          return image;
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

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
