(function() {

  let myTab;

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  document.addEventListener('visibilitychange', function() {
    switch (document.visibilityState) {

      case "hidden" : 
        
        break;

      case "visible" : 

        break;

    }
    document.title = document.visibilityState;
    console.log(document.visibilityState);
  });

  function sendMessageToBackgroundScript(msg) {

    browser.runtime.sendMessage( {
        type: "setHiddenTimer",
        message: msg
    })
  }

  browser.runtime.onMessage.addListener((message) => {
    console.log("in onMessage.addListener of timer message.type = " + message.message);
    switch (message.message) {
       
      case "reset": 
        sendMessageToBackgroundScript(message)
        break;
      
      case "time":
        sendMessageToBackgroundScript(message)
        break;  

    }
    
  }) 

})();
