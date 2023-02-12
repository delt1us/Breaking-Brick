import './style.css'

import {Game} from '/scripts/Game';

function animate(timeNow)
{
    m_Game.Update(timeNow);
    m_Game.Draw();
    window.requestAnimationFrame(animate);
}

var m_Game = new Game();
window.requestAnimationFrame(animate);