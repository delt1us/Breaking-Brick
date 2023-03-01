class Timer {
    #f_Timer;
    #b_Paused;
    #m_Div;
    constructor(divID) {
        this.#f_Timer = 0;
        this.#b_Paused = true;
        this.#m_Div = document.getElementById(divID);
    }

    // Called from Game.Update
    Update(f_TimeSincePreviousFrame) {
        if (!this.#b_Paused) {
            this.#AddTime(f_TimeSincePreviousFrame);
        }
        this.#UpdateDiv();
    }

    // Called from Ball.Launch()
    Start() {
        this.#b_Paused = false;
    }

    // Called from Ball.RemoveLife()
    Stop() {
        this.#b_Paused = true;
    }

    #AddTime(time) {
        if (time === NaN) {
            return;
        }
        this.#f_Timer += time / 1000;
    }

    #UpdateDiv() {
        let string = `${Math.round(this.#f_Timer)}`;
 
        if (Math.round(this.#f_Timer) < 10) {
            string = "0" + string;
        }
        
        this.#m_Div.innerHTML = string;
    }
}