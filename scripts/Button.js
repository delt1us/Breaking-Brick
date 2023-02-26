export const ButtonStates = {
    Play: false,
    Settings : false
}

document.getElementById("playbutton").onclick = function () {
    console.log("play button pressed");
    ButtonStates.Play = true;
}

document.getElementById("settingsbutton").onclick = function () {
    console.log("settings button pressed");
    ButtonStates.Settings = true;
}