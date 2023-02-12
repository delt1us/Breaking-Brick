// This file contains the event listeners and what happens when keys are pressed
// KeySates object
export const KeyStates = {
    d: false,
    a: false
};

// Keypress detection
document.addEventListener("keydown", function onEvent(event) {
    // Go right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = true;
    }
    // Go left
    else if (event.key == "a" || event.key == "A") {
        KeyStates.a = true;
    }
});

// Key release detection
document.addEventListener("keyup", function onEvent(event) {
    // Stop right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = false;
    }
    // Stop left
    else if (event.key == "a" || event.key == "A") {
        KeyStates.a = false;
    }
});