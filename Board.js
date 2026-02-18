export class Board {
    constructor(c){
        this.ctx = c;
    }


    clean(){
        console.log("cleaned");
        this.ctx.clearRect(0,0,320,640);
        this.ctx.fillStyle = "#fff7";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#fff7";
        for (let i = 32; i <= 320; i += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(i,0);
            this.ctx.lineTo(i,640);
            this.ctx.stroke();
        }
        for (let j = 32; j <= 640; j += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(0,j);
            this.ctx.lineTo(320,j);
            this.ctx.stroke();
        }
    }
}