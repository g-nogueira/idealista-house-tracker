import { extractHouseInfo } from '../lib/service';
import { storage } from '../lib/storage';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveHouse",
        title: "Consider this house",
        contexts: ["page"],
        documentUrlPatterns: ["*://*.idealista.pt/*"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "saveHouse" && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'extractHouseInfo' }, async (houseInfo) => {
            if (houseInfo) {
                console.log("Event Processing")
                await storage.addHouse(houseInfo);
            }
        });
    }
});