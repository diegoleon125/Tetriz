export class Timer {
    constructor(func) {
        this.id = null;
        this.state = 0;
        this.speed = 1;
        this.func = func;
        this.startTime = null;
        this.remaining = 0;
    }

    start() {
        if (this.state !== 0) return;
        this.startTime = new Date();
        let delay = this.remaining > 0 ? this.remaining : 1000 / this.speed;
        this.id = setTimeout(() => this.callback(), delay);
        this.state = 1;
    }
    pause() {
        if (this.state !== 1) return;
        if (this.remaining){
            this.remaining = this.remaining - (new Date() - this.startTime);
        } else {
            this.remaining = 1000 - (new Date() - this.startTime);
            this.startTime = new Date();
        }
        clearTimeout(this.id);
        this.state = 0;
        console.log(this.remaining + "ms remaining");
    }
    stop() {
        clearTimeout(this.id);
        this.state = 0;
        this.remaining = 0;
    }
    callback(){
        this.func();
        if (this.state != 0){
            this.state = 0;
            this.remaining = 0;
            this.start();
        }
    }
}
