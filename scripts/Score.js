export class ScoreCounter {
    #i_Score;
    // Div object it will update
    #m_Div;
    #b_Hidden;
    constructor(divID) {
        this.#i_Score = 0;
        this.#b_Hidden = false;
        this.#m_Div = document.getElementById(divID);
    }

    Hide() {
        this.#b_Hidden = true;
        this.#UpdateDiv();
    }

    // Called from Ball.HandleCollisions
    Add(value) {
        this.#i_Score += value;
        this.#UpdateDiv();
    }

    // Updates the html scorecounter
    #UpdateDiv() {
        let string = this.#i_Score.toString();

        if (this.#b_Hidden) {
            string = "";
        }
        else {
            string = `SCORE:${("0".repeat(4 - string.length))}${string}`;
        }

        this.#m_Div.innerHTML = string;
    }
}