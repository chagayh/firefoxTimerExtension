function initButtons() {

    const autoModeBtn = document.getElementById("autoModeBtn")
    const menualModeBtn = document.getElementById("menualModeBtn")
    const subTitle1 = document.getElementById("subTitle1")
    const timeSelect = document.getElementById("timeSelect")
    const timeInput = document.getElementById("timeInput")
    // document.getElementById("demo").innerHTML = "hello world"

    autoModeBtn.addEventListener('click', function(){
        subTitle1.hidden = false
        timeSelect.hidden = false
    })

    menualModeBtn.addEventListener('click', function(){
        subTitle1.hidden = false
        timeSelect.hidden = false
    })


    timeSelect.addEventListener('change', (e) => {
        switch (e.target.selectedIndex) {
            case 0:     // case 1 hour
                sendMessage(e.target.selectedIndex);
                break;
            case 1:     // case 3 hour
                sendMessage(e.target.selectedIndex);
                break;
            case 2:     // case 5 hour
                sendMessage(e.target.selectedIndex);
                break;
            case 3:     // case other
                timeInput.hidden = false;
                break;
        }
    })

    timeInput.addEventListener('change', function() {
        sendMessage(timeInput.value);
    })
}

function sendMessage(time) {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        console.log("tab[0].id = " + tabs[0].id + " in sendMessage of chooseMode")
        browser.tabs.sendMessage(tabs[0].id, {
            message: "time",
            tabId: tabs[0].id,
            time: 0.1
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
