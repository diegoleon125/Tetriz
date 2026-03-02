import {Tetro} from './Tetro.js';
export class Board {
    constructor(gmovr){
        this.ctx = null;
        this.backup = document.createElement('canvas');
        this.lines = document.createElement('canvas');
        this.backup.width = 320;
        this.backup.height = 640;
        this.lines.width = 320;
        this.lines.height = 640;
        this.grid = Array.from({length:20},() => Array(10).fill(0));
        this.tetro = null;
        this.blocks = new Image();
        this.blocks.src = '/img/blocks.png';
        this.gameoverfunc = gmovr;
    }
    

    clean(){
        this.grid = Array.from({length:20},() => Array(10).fill(0));
        console.log("cleaned");
        let lctx = this.lines.getContext('2d');
        let bctx = this.backup.getContext('2d');
        this.ctx.clearRect(0,0,320,640);
        bctx.clearRect(0,0,320,640);
        if (lctx){
            lctx.clearRect(0,0,320,640);
            lctx.fillStyle = "#fff7";
            lctx.lineWidth = 2;
            lctx.strokeStyle = "#fff7";
            for (let i = 32; i <= 320; i += 32) {
                lctx.beginPath();
                lctx.moveTo(i,0);
                lctx.lineTo(i,640);
                lctx.stroke();
            }
            for (let j = 32; j <= 640; j += 32) {
                lctx.beginPath();
                lctx.moveTo(0,j);
                lctx.lineTo(320,j);
                lctx.stroke();
            }
        }
        bctx.drawImage(this.lines,0,0)
        this.ctx.drawImage(this.lines,0,0);
        this.tetro = null;
        this.save();
    }
    save(){
        let bctx = this.backup.getContext('2d');
        bctx.clearRect(0,0,320,640);
        bctx.drawImage(this.lines,0,0);
        
        for (let i = 0; i < 20; i++){
            for (let j = 0; j < 10; j++){
                if (this.grid[i][j]) bctx.drawImage(this.blocks,this.grid[i][j] * 32, 0,32,32,j *32,i * 32,32,32);
            }
        }
    }
    restore(){
        this.ctx.clearRect(0,0,320,640);
        this.ctx.drawImage(this.backup,0,0);
    }
    addTetro(){
        if (this.tetro != null) {
            const obj = this.tetro.obj;
            const x = this.tetro.x;
            const y = this.tetro.y;
            for (let i = 0; i < obj.length; i++) {
                for (let j = 0; j < obj[i].length; j++){
                    if (obj[i][j]) this.grid[i+y][j+x] = obj[i][j];
                }
            }
        }
        this.tetro = new Tetro(Math.ceil(Math.random() * 7));
        this.save();
        if (this.canFit(0,0)){
            this.drawTetro();
        } else if (this.canFit(-1,0)) {
            this.tetro.x--;
        } else if (this.canFit(1,0)) {
            this.tetro.x++;
        } else {
            this.gameoverfunc();
        }
        console.log("ctx saved");
    }
    drawTetro(){
        this.restore();
        console.log("cctx restored");
        const obj = this.tetro.obj;
        const x = this.tetro.x;
        const y = this.tetro.y;
        let yy = 0;
        while (this.canFit(0,yy + 1)){
            yy++;
        }
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < obj[i].length; j++){
                if (obj[i][j]){
                    this.ctx.drawImage(this.blocks,0,0,32,32,(j+x) * 32,(i+y+yy)*32,32,32);
                    this.ctx.drawImage(this.blocks,obj[i][j] * 32,0,32,32,(j+x) * 32,(i+y) * 32,32,32);
                }
            }
        }
    }
    move(rh = 1){
        if (this.canFit(rh,0)){
            this.tetro.x += rh;
            this.drawTetro();
        }
    }
    down(){
        if (this.canFit(0,1)){
            this.tetro.y++;
            this.drawTetro();
        } else {
            this.place();
        }        
    }
    place(){
        let yy = 0;
        while (this.canFit(0,yy + 1)){
            yy++;
        }
        this.tetro.y += yy;
        this.addTetro();
        this.checkFullRows();
        this.drawTetro();
    }
    rotate(hor = true){
        let obj = this.tetro.obj.map(row => [...row]);
        obj = obj[0].map((_,index) => obj.map(row => row[index]));
        obj = hor ? obj.map(row => row.reverse()) : obj.reverse(); 

        const oldObj = this.tetro.obj;
        this.tetro.obj = obj;

        if (this.canFit(0,0)){
            this.drawTetro();
        } else if (this.canFit(-1,0)){
            this.tetro.x--;
            this.drawTetro();
        } else if (this.canFit(1,0)){
            this.tetro.x++;
            this.drawTetro();
        } else {
            this.tetro.obj = oldObj;
        }
        
    }
    canFit(xx, yy){
        const obj = this.tetro.obj;
        const x = this.tetro.x;
        const y = this.tetro.y;
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < obj[i].length; j++){
                //console.log("x y" + x + " " + y);
                //console.log("xx yy" + xx + " " + yy);
                //console.log("i j" + i + " " + j);
                //console.log("iyyy = " + (i+y+yy) + " jxxx = " + (j+x+xx));
                if (obj[i][j] &&(i+y+yy >= 20 || j+x+xx < 0 || j+x+xx >= 10 || this.grid[i+y+yy][j+x+xx])){
                    return false;
                }
            }
        }
        return true;
    }
    checkFullRows(){
        let newgrid = this.grid.filter(row => row.includes(0));
        const total = this.grid.length - newgrid.length;
        if (total){
            //add points for each line cleared
            for (let i = 0; i < total; i++){
                newgrid.unshift(new Array(10).fill(0));
            }
            this.grid = newgrid;
            this.save();
            this.restore();
        }
    }
    
}