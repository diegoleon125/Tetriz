import {Board} from './Board.js';

//ATRIBUTES
let gs= -1;
let board;
document.addEventListener('DOMContentLoaded', () =>{
    dBtn("spc","play","PLAY",() => {
            start();
        })
    const canv = document.getElementById("gm");
    const ctx = canv.getContext("2d");
    board = new Board(ctx);
})
window.addEventListener("keydown", (e) => {
    if (["Enter","Space","KeyQ","KeyW"].includes(e.code) && e.repeat) return;

    if (e.code === "Enter") start();
    if (gs >= 0){
        if (e.code === "ArrowLeft" || e.code === "KeyA") move(-1);
        if (e.code === "ArrowRight" || e.code === "KeyD") move();
        if (e.code === "ArrowDown" || e.code === "KeyS") down();
        if (e.code === "KeyQ") rotate(false);
        if (e.code === "KeyW") rotate();
        if (e.code === "Space") place();
    }
});
    
//GAME FUNCTS
function start(){
    if (gs >= 0) return pause();
    const btn = document.getElementById("play");
    if (btn) fade(btn,0,500,() => {btn.remove();});
    gs = 0;

    console.log("starting");
    board.clean();
    const canv = document.getElementById("gm");
    const ctx = canv.getContext("2d");
    ctx.fillStyle = "#fff7";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff7";
    for (let i = 32; i <= 320; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,640);
        ctx.stroke();
    }
    for (let j = 32; j <= 640; j += 32) {
        ctx.beginPath();
        ctx.moveTo(0,j);
        ctx.lineTo(320,j);
        ctx.stroke();
    }
}
function pause(){

}
function end(){
    
}

//INPUT FUNCTS
function move(rh = 1){

}
function down(){

}
function place(){

}
function rotate(hor = true){

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