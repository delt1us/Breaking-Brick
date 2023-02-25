import './style.css'

import {Game} from '/scripts/Game';

function animate(timeNow)
{
    m_Game.Update(timeNow);
    m_Game.Draw();
    window.requestAnimationFrame(animate);
}

let m_Game;

window.onload = function() {
    m_Game = new Game();
    window.requestAnimationFrame(animate);
}
