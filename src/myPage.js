let myTab;

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
    








})


function createMyTab(){
    document.body.style.border = "5px solid red"
}


console.log("thanks god")
createMyTab()