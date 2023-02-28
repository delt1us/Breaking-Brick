// This file contains the event listeners and what happens when keys are pressed
// KeySates object
export const KeyStates = {
    d: false,
    a: false,
    space: false,
    esc: false
};

// Keypress detection
document.addEventListener("keydown", function onEvent(event) {
    // Go right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = true;
    }
    // Go left
    if (event.key == "a" || event.key == "A") {
        KeyStates.a = true;
    }

    if (event.key == " ") {
        KeyStates.space = true;
    }

    if (event.key === "Escape") {
        KeyStates.esc = true;
        console.log("escape");
    }
});

// Key release detection
document.addEventListener("keyup", function onEvent(event) {
    // Stop right
    if (event.key == "d" || event.key == "D") {
        KeyStates.d = false;
    }
    // Stop left
    if (event.key == "a" || event.key == "A") {
        KeyStates.a = false;
    }

    if (event.key == " ") {
        KeyStates.space = false;
    }

    if (event.key == "Escape") {
        KeyStates.esc = false;
    }
});