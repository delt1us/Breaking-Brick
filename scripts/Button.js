export const ButtonStates = {
    Play: false,
    Settings: false,
    Back: false,
    Create: false,
    BackLevelCreate: false
};

document.getElementById("playbutton").onclick = function () {
    console.log("play button pressed");
    ButtonStates.Play = true;
};

document.getElementById("settingsbutton").onclick = function () {
    console.log("settings button pressed");
    ButtonStates.Settings = true;
};

document.getElementById("backButtonLevelSelect").onclick = function() {
    console.log("back button pressed");
    ButtonStates.Back = true;
};

document.getElementById("levelDesignerButton").onclick = function() {
    console.log("create button pressed");
    ButtonStates.Create = true;
};


document.getElementById("backButtonLevelCreate").onclick = function() {
    console.log("back button pressed");
    ButtonStates.BackLevelCreate = true;
};
