import './style.css'
import { Game } from '/scripts/Game';

function animate(timeNow) {
    m_Game.Update(timeNow);
    m_Game.Draw();
    window.requestAnimationFrame(animate);
}

// Needed so that animate can see game
let m_Game;

// Waits until DOM is finished loading to start the game
window.onload = function () {
    m_Game = new Game();
    window.requestAnimationFrame(animate);
}
