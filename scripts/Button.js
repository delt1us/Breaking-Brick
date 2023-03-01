export const ButtonStates = {
    Play: false,
    Settings: false,
    Back: false,
    Create: false,
    BackLevelCreate: false,
    SaveLevel: false,
    QuitPauseMenu: false,
    ContinuePauseMenu: false,
    SettingsPauseMenu: false,
    BackFinishedMenu: false
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
    console.log("back level select pressed");
    ButtonStates.Back = true;
};

document.getElementById("levelDesignerButton").onclick = function() {
    console.log("level designer pressed");
    ButtonStates.Create = true;
};

document.getElementById("backButtonLevelCreate").onclick = function() {
    console.log("back level designer pressed");
    ButtonStates.BackLevelCreate = true;
};

document.getElementById("saveLevelButton").onclick = function() {
    console.log("save pressed");
    ButtonStates.SaveLevel = true;
};

document.getElementById("quitButtonPauseUI").onclick = function() {
    console.log("quit pause menu pressed");
    ButtonStates.QuitPauseMenu = true;
};

document.getElementById("settingsButtonPauseUI").onclick = function() {
    console.log("settings button pause menu pressed");
    ButtonStates.SettingsPauseMenu = true;
};

document.getElementById("continueButtonPauseUI").onclick = function() {
    console.log("continue pause menu pressed");
    ButtonStates.ContinuePauseMenu = true;
};

document.getElementById("backButtonGameFinished").onclick = function() {
    console.log("back game finished pressed");
    ButtonStates.BackFinishedMenu = true;
};