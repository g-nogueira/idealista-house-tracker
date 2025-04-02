import { extractHouseInfo } from '../lib/service';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractHouseInfo') {
        const houseInfo = extractHouseInfo(document);
        sendResponse(houseInfo);
    }
});