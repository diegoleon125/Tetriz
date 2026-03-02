import {Board} from './Board.js';
import {Timer} from './Timer.js';
//ATRIBUTES
let gs= -1;//0pause 1play 2end
const board = new Board(end);
const loop = new Timer(fall);
let speed = 1;
document.addEventListener('DOMContentLoaded', () =>{
    dBtn("spc","play","PLAY",() => {start();});
    const canv = document.getElementById("gm");
    const ctx = canv.getContext("2d");
    board.ctx = ctx;
})
window.addEventListener("keydown", (e) => {
    if (["Enter","Space","KeyQ","KeyW"].includes(e.code) && e.repeat) return;

    if (e.code === "Enter") start();
    if (gs > 0){
        if (e.code === "ArrowLeft" || e.code === "KeyA") board.move(-1);
        if (e.code === "ArrowRight" || e.code === "KeyD") board.move();
        if (e.code === "ArrowDown" || e.code === "KeyS") board.down();
        if (e.code === "KeyQ") board.rotate(false);
        if (e.code === "KeyW") board.rotate();
        if (e.code === "Space") board.place();
    }
});
    
//GAME FUNCTS
function start(){
    if (gs > 0) return pause();
    let btn = document.getElementById("play");
    if (!btn) btn = document.getElementById("continue");
    fade(btn,0,500,() => {btn.remove();});
    if (gs == -1){
        board.clean();
        board.addTetro();
    }
    gs = 1;
    console.log("starting");
    
    loop.start();
}
function pause(){
    if (gs){
        loop.pause();
        console.log("paused");
        let btn = document.getElementById("continue");
        if (btn) btn.remove();
        dBtn("spc","continue","CONTINUE",() => {start();});
    } else {
        loop.start();
        console.log("started");
    }
    gs = gs == 0 ? 1 : 0;
}
function end(){
    loop.stop();
    gs = -1;
    dBtn("spc","continue","NEW_GAME",() => {start();});


}

//INPUT FUNCTS
function fall(){
    console.log("speed: " + loop.speed)
    board.down();
}
function pauseInterval(){

}


//BACK FUNCTS
function dBtn(parentid,id,text,func){   //create button
    const par = document.getElementById(parentid);
    const btn = document.createElement('button');
    btn.id = id;
    btn.classList.add("rbwdiv");
    btn.classList.add("btn");
    btn.innerHTML = text;
    par.appendChild(btn);

    btn.addEventListener('click',func);
} //this func has only one use at the time

function fade(elem,to,time,func){
    elem.disabled = true;
    let it = Math.round(time/100);
    let op2= 1/ it;
    op2 *= to == 0? -1: 1; 
    let foo = setInterval(() => {
        let xd = parseFloat(window.getComputedStyle(elem).opacity);
        xd += op2;
        elem.style.opacity = xd;
        it--;
        if (it == 0){
            func();
            clearInterval(foo);
        }
    },125);
} //this too