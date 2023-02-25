export class ScoreCounter {
    #i_Score;
    // Div object it will update
    #m_Div;
    constructor(divID) {
        this.#i_Score = 0;
        this.#m_Div = document.getElementById(divID);
    }

    // Called from Game.Update()
    Update() {
        this.#UpdateDiv();
    }
 
    // Called from Ball.HandleCollisions
    Add(value) {
        this.#i_Score += value;
    }

    // Updates the html scorecounter
    #UpdateDiv() {
        let string = this.#i_Score.toString();
        string = `SCORE:${("0".repeat(4 - string.length))}${string}`;
        this.#m_Div.innerHTML = string;
    }
}