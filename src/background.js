function handleActivated(activeInfo) {
    console.log("Tab " + activeInfo.tabId + " was activated");
    browser.tabs.sendMessage(activeInfo.tabId, {message: activeInfo.previousTabId})
  }


browser.tabs.onActivated.addListener(handleActivated);