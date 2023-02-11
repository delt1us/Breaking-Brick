import './style.css'

import {Game} from '/scripts/Game';

function animate()
{
    m_Game.Update();
    m_Game.Draw();
    window.requestAnimationFrame(animate);
}

var m_Game = new Game();
window.requestAnimationFrame(animate);