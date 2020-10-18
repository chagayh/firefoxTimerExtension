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
            case 0: 
                console.log("in timeSelect " + e.target.selectedIndex)
                break;
            case 1: 
                console.log("in timeSelect " + e.target.selectedIndex)
                break;
            case 2: 
                console.log("in timeSelect " + e.target.selectedIndex)
                break;
            case 3: 
                timeInput.hidden = false;
                break;
        }
    })

}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "/content_scripts/timer.js"})
.then(initButtons)
.catch(reportExecuteScriptError);
