function initButtons() {

    var responseText  = document.getElementById("response");
    const hiddenBtn     = document.getElementById("hidden");
    const autoModeBtn   = document.getElementById("auto");
    var hoursInput    = document.getElementById("hours");
    var minutesInput  = document.getElementById("minutes");
    const submitBtn     = document.getElementById("submitBtn");

    submitBtn.addEventListener('click', function() {
        let hoursToInt = parseInt(hoursInput.value);
        let minutesToInt = parseInt(minutesInput.value);
        if (hoursToInt === 0 && minutesToInt === 0) {
            responseText.innerHTML = "set time for timer";
        } else if (!Number.isInteger(hoursToInt) || !Number.isInteger(minutesToInt) || hoursToInt < 0 || minutesToInt < 0) {
            console.log("in second if of submitBtn")
            responseText.innerHTML = "Not valid input"
        } else {
            let time = (hoursToInt * 60) + minutesToInt;
            let whenToActivate = (hiddenBtn.checked) ? "hidden" : "active";
            let mode = (autoModeBtn.checked) ? "auto" : "menual";
            sendMessage(time, whenToActivate, mode);
        }
    })
}

function sendMessage(time, whenToActivate, mode) {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        console.log("tab[0].id = " + tabs[0].id + " in sendMessage of chooseMode")
        browser.tabs.sendMessage(tabs[0].id, {

            tabId       : tabs[0].id,
            type        : whenToActivate,
            timerMode   : mode,
            time        : time

        })
    }); 
}

function reportExecuteScriptError(error) {
    console.error(`Failed to execute popup content script: ${error.message}`)
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "../content_scripts/timer.js"})
.then(initButtons)
.catch(reportExecuteScriptError);
