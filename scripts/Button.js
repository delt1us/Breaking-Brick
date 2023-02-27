import { d_DISABLED_BUTTONS } from "./Game";

export const ButtonStates = {
    Play: false,
    Settings : false
}

document.getElementById("playbutton").onclick = function () {
    if (!d_DISABLED_BUTTONS.Play) {
        console.log("play button pressed");
        ButtonStates.Play = true;
    }
}

document.getElementById("settingsbutton").onclick = function () {
    if (!d_DISABLED_BUTTONS.Settings) {
        console.log("settings button pressed");
        ButtonStates.Settings = true;
    }
}