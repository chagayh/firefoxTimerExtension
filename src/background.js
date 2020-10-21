var currTab;
let tabsWithTimer = new Map();      // key = tabId, value = { when: "hidden/visible", time: time }

/*
Adds or restart an alarm for the currently active tab.
*/
function resetTimer(message) {
    console.log("message.time = " + message.time)
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
    console.log("in onAlarm of background, alarm name = " + nameAsInt + " alarm was activated = " + tabsWithTimer.get(nameAsInt).activated);
});

function printTabsMap() {
    for (let [key, value] of tabsWithTimer) {
        console.log(key + ' = ' + value.when)
    }
}


browser.tabs.onActivated.addListener((activeInfo) => {
    printTabsMap();
    currTab = activeInfo.tabId;
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
//     console.log("Left tab " + activeInfo.previousTabId);
    console.log("Tab " + activeInfo.tabId + " was activated");
});

browser.runtime.onMessage.addListener(function(msg) {
    console.log("in onMessage listener message type " + msg.type);
    switch (msg.type) {

        case "hidden":
            console.log("hidden");
            if (tabsWithTimer.has(msg.tabId)) {
                tabsWithTimer.delete(msg.tabId);
            }
            tabsWithTimer.set(msg.tabId, { timerMode: msg.timerMode, when: "hidden", time: msg.time, activated: false });
            break;

        case "active":
            console.log("active");
            if (tabsWithTimer.has(msg.tabId)) {
                tabsWithTimer.delete(msg.tabId);
            }
            tabsWithTimer.set(msg.tabId, { timerMode: msg.timerMode, when: "visible", time: msg.time, activated: false });
            resetTimer(msg);
            break;

        case "reset":
            // set activated to false
            break;

        case "removeTimer":
            console.log("in removeTimer");
            if (tabsWithTimer.has(msg.tabId)) {
                removeTimer(msg.tabId);
            }
            break;

        default:
            console.log("in default");
            break;

    }

  })  