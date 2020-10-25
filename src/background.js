var currTab;
let tabsWithTimer = new Map();      // key = tabId, value = { when: "hidden/visible", time: time, url: "url add" }

/*
Adds or restart an alarm for the currently active tab.
*/
function resetTimer(message) {
    browser.alarms.create(
        message.tabId.toString(), 
        { delayInMinutes: message.time }
        );
}

function removeTimer(tab) {
    browser.alarms.clear(
        tab.toString()
    )
    tabsWithTimer.delete(tab);
}

browser.alarms.onAlarm.addListener((alarm) => {
    let nameAsInt = Number.parseInt(alarm.name)
    tabsWithTimer.get(nameAsInt).activated = true;
    if (tabsWithTimer.get(nameAsInt).timerMode === "auto") {
        browser.tabs.remove(nameAsInt);
        tabsWithTimer.delete(nameAsInt);
    } else {    
        localStorage.setItem('tabIdKey', nameAsInt);
        localStorage.setItem('urlKey', tabsWithTimer.get(nameAsInt).tabUrl);
        let createData = {
            type: "detached_panel",
            url: "../confirm_popup/confirm_popup.html",
            width: 600,
            height: 400
          };
        browser.windows.create(createData);
    }
});

browser.tabs.onActivated.addListener((activeInfo) => {
    currTab = activeInfo.tabId;
    if (tabsWithTimer.has(activeInfo.tabId) && tabsWithTimer.get(activeInfo.tabId).when === "hidden") {
        resetTimer({ tabId: activeInfo.tabId, time: tabsWithTimer.get(activeInfo.tabId).time })
    }
    if (tabsWithTimer.has(activeInfo.previousTabId) && !tabsWithTimer.get(activeInfo.previousTabId).activated) {
        let prevValue = tabsWithTimer.get(activeInfo.previousTabId)
        if (prevValue.when == "hidden") {
            let message = { 
                tabId: activeInfo.previousTabId, 
                time: prevValue.time 
            }
            resetTimer(message)
        }
    }
});

browser.runtime.onMessage.addListener(function(msg) {
    switch (msg.type) {

        case "hidden":
            if (tabsWithTimer.has(msg.tabObj.id)) {
                tabsWithTimer.delete(msg.tabObj.id);
            }
            tabsWithTimer.set(msg.tabObj.id, { 
                timerMode: msg.timerMode, 
                when: "hidden", 
                time: msg.time, 
                activated: false, 
                tabUrl: msg.tabObj.url 
            });
            break;

        case "active":
            if (tabsWithTimer.has(msg.tabObj.id)) {
                tabsWithTimer.delete(msg.tabObj.id);
            }
            tabsWithTimer.set(msg.tabObj.id, { 
                timerMode: msg.timerMode, 
                when: "visible", 
                time: msg.time, 
                activated: false, 
                tabUrl: msg.tabObj.url 
            });
            resetTimer({
                tabId: msg.tabObj.id, 
                time: msg.time 
            });
            break;

        case "reset":
            var nameAsString = localStorage.getItem('tabIdKey');
            var nameAsInt    = Number.parseInt(nameAsString); 
            if (tabsWithTimer.has(nameAsInt)) {
                let message = { 
                    tabId: nameAsInt, 
                    time: tabsWithTimer.get(nameAsInt).time 
                }
                resetTimer(message);
            }
            break;

        case "close":
            var nameAsString = localStorage.getItem('tabIdKey');
            var nameAsInt    = Number.parseInt(nameAsString);
            browser.tabs.remove(nameAsInt);
            tabsWithTimer.delete(nameAsInt);
            break;

        case "removeTimer":
            var tabName = msg.tabObj;
            if (tabName === undefined) {
                tabName = localStorage.getItem('tabIdKey');
            } else {
                tabName = msg.tabObj.id;
            }

            if (tabsWithTimer.has(tabName)) {
                removeTimer(tabName);
            }
            break;

        default:
            break;

    }
  })  