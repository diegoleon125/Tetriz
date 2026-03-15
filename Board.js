/*
 * Clase del grid
 * Autor: Diego León
 */
import {Tetro} from './Tetro.js';
export class Board {
    constructor(gmovr, clr){
        this.last3 = [];
        /** @type {CanvasRenderingContext2D}*/
        this.ctx = null;
        /** @type {CanvasRenderingContext2D}*/
        this.nctx = null;
        this.backup = document.createElement('canvas');
        this.lines = document.createElement('canvas');
        this.grid = Array.from({length:20},() => Array(10).fill(0));
        this.tetro = null;
        this.next = null;
        this.blocks = new Image();
        this.gameoverfunc = gmovr;
        this.clearfunc = clr;
        this.canchange = true;

        this.backup.width = 320;
        this.backup.height = 640;
        this.lines.width = 320;
        this.lines.height = 640;
        this.blocks.src = './img/blocks.png';
    }
    //BOARD
    clean(){
        this.grid = Array.from({length:20},() => Array(10).fill(0));
        this.tetro = null;
        this.next = null;
        let lctx = this.lines.getContext('2d');
        let bctx = this.backup.getContext('2d');
        this.ctx.clearRect(0,0,320,640);
        bctx.clearRect(0,0,320,640);
        //add lines
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
        //set lines
        bctx.drawImage(this.lines,0,0)
        this.ctx.drawImage(this.lines,0,0);
        this.save();
    }
    save(){ //save a backup of current grid
        let bctx = this.backup.getContext('2d');
        bctx.clearRect(0,0,320,640);
        bctx.drawImage(this.lines,0,0);
        
        for (let i = 0; i < 20; i++){
            for (let j = 0; j < 10; j++){
                if (this.grid[i][j]) bctx.drawImage(this.blocks,this.grid[i][j] * 32, 0,32,32,j *32,i * 32,32,32);
            }
        }
    }
    restore(){ //get the backup
        this.ctx.clearRect(0,0,320,640);
        this.ctx.drawImage(this.backup,0,0);
    }
    //TETROS
    getNextTetro(){
        this.tetro = this.next;
        let num;
        let i = 0;
        do {
            num = Math.ceil(Math.random() * 7);
        } while (this.last3.includes(num) && i < 10);
        this.last3.push(num);
        if (this.last3.length > 3) this.last3.shift();
        this.next = new Tetro(num);
    }
    drawNextTetro(){ //draw next tetro in next
        this.nctx.clearRect(0,0,192,192);
        const obj = this.next.obj;
        this.nctx.fillStyle = "#fff";
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < obj[i].length; j++){
                if (obj[i][j]) this.nctx.fillRect((j+1)*32,(i+1)*32,32,32);
            }
        }
    }
    addTetro(){ // add the current tetro in grid and get and place next
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
        //get next
        this.getNextTetro();
        this.drawNextTetro();
        // draw next
        this.save();
        if (this.canFit(0,0)){
            this.drawTetro();
        } else if (this.canFit(-1,0)) {
            this.tetro.x--;
            this.drawTetro();
        } else if (this.canFit(1,0)) {
            this.tetro.x++;
            this.drawTetro();
        } else {
            this.gameoverfunc();
        }
    }
    drawTetro(){ //draw current tetro in actual grid
        this.restore();
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
    //INPUT
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
        this.canchange = true;
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
    change(){
        if (!this.canchange) return;
        let {x,y} = new Tetro(this.tetro.num);
        this.tetro.x = x;
        this.tetro.y = y;
        let temp = this.next;
        this.next = this.tetro;
        this.tetro = temp;

        this.canchange = false;
        this.drawNextTetro();
        this.drawTetro();
    }
    //VALIDATIONS
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
                if (obj[i][j] && i+y+yy >= 0 &&(i+y+yy >= 20 || j+x+xx < 0 || j+x+xx >= 10 || this.grid[i+y+yy][j+x+xx])){
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
            this.clearfunc(total);
        }
    }
    
}