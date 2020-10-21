var currTab;
let tabsWithTimer = new Map();      // key = tabId, value = { when: "hidden/visible", time: time }

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
    console.log("in onAlarm of background, alarm name = " + alarm.name);
});

function printTabsMap() {
    for (let [key, value] of tabsWithTimer) {
        console.log(key + ' = ' + value.when)
    }
}


browser.tabs.onActivated.addListener((activeInfo) => {
    printTabsMap();
    currTab = activeInfo.tabId;
    if (tabsWithTimer.has(activeInfo.previousTabId)) {
        let prevValue = tabsWithTimer.get(activeInfo.previousTabId)
        if (prevValue.when == "hidden") {
            let message = { 
                tabId: activeInfo.previousTabId, 
                time: prevValue.time 
            }
            resetTimer(message)
        }
    }
//     console.log("Left tab " + activeInfo.previousTabId);
    console.log("Tab " + activeInfo.tabId + " was activated");
});

browser.runtime.onMessage.addListener(function(msg) {
    console.log("in onMessage listener message " + msg.message.message);
    let message = msg.message
    switch (msg.type) {

        case "setHiddenTimer":
            console.log("in setHiddenTimer");
            if (! tabsWithTimer.has(message.tabId)) {
                tabsWithTimer.set(message.tabId, { when: "hidden", time: message.time });
            }
            break;

        case "setVisibleTimer":
            console.log("in setVisibleTimer");
            if (! tabsWithTimer.has(message.tabId)) {
                tabsWithTimer.set(message.tabId, { when: "visible", time: message.time });
                resetTimer(message);
            }
            break;

        case "reset":
            break;

        case "removeTimer":
            console.log("in removeTimer");
            if (tabsWithTimer.has(message.tabId)) {
                removeTimer(message.tabId);
            }
            break;

        default:
            console.log("in default");
            break;

    }

  })  