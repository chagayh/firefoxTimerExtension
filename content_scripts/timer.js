(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    // Get information about a tab when it is activated - 
    async function logListener(info) {
      try {
        let tabInfo = await browser.tabs.get(info.tabId);
        console.log(tabInfo);
      } catch (error) {
        console.error(error);
      }
    }

    
    function setAlarm(time) {
      console.log("in setAlarm");
      browser.tabs[0].alarms.create("", {
        delayInMinutes: 10
      })
    }

    // browser.tabs.onActivated.addListener(logListener)
    browser.runtime.onMessage.addListener((message) => {
      console.log("message.message = " + message.message);
      // console.log("browser.tabs.get() = " + await browser.tabs.get());
      // setAlarm(message.time);
    })  
  })();
