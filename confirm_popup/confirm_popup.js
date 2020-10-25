function setUrlText() {
    var url = localStorage.getItem('urlKey');
    document.getElementById("url").innerHTML = url;
}

function sendMessageToBackgroundScript(msg) {
    let sent = browser.runtime.sendMessage( msg );
    sent.then(closeWindow);
}

function closeWindow() {
    window.close();
}

function initButtons() {
    const sureBtn   = document.getElementById("sureBtn");       // remove the tab
    const resetBtn  = document.getElementById("resetBtn");      // reset the timer
    const cancelBtn = document.getElementById("cancelBtn");     // cancel the alarm

    sureBtn.addEventListener('click', function() {
        var msg = { type: "close" };
        sendMessageToBackgroundScript(msg);
    });

    resetBtn.addEventListener('click', function() {
        var msg = { type: "reset" };
        sendMessageToBackgroundScript(msg);
    });

    cancelBtn.addEventListener('click', function() {
        var msg = { type: "removeTimer" };
        sendMessageToBackgroundScript(msg);
    });
}



setUrlText();
initButtons();