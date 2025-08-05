

// this function will set the handlers for the buttons
function setHandlers() {

    // get the submit button
    const submitButton = document.getElementById("submit-button");

    // set the handler for the submit button
    submitButton.onclick = handleSumbitButton;


    // get tanspose up button
    const transposeUpButton = document.getElementById("transpose-up");

    // set handler for the transpose up button
    transposeUpButton.onclick = handleTransposeUpButton;

    // get tanspose up button
    const transposeDpButton = document.getElementById("transpose-down");

    // set handler for the transpose up button
    transposeDpButton.onclick = handleTransposeDownButton;

}

// this function will be called when this script will be loaded
function main() {
    setHandlers();
}


main();