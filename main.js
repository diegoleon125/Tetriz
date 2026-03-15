/*
 * Proyecto: Tetri-z (diy fanmade)
 * Autor: Diego León
 * Fecha: 2026-03-
 */
import {Board} from './Board.js';
import {Timer} from './Timer.js';
//ATRIBUTES
let gs= -1;//0pause 1play 2end
let t = 0;
let p = 0;
let bestscore = 0;
let besttime = 0;
const board = new Board(end, acc);
const loop = new Timer(fall);
const time_loop = new Timer(() => {
    t++;
    if (t % 4000 == 0) loop.speed = (loop.speed * 1.02).toFixed(2);
    document.getElementById("time").innerHTML = "tiempo: " + msToTime(t);
    },1000);

document.addEventListener('DOMContentLoaded', () =>{
    dBtn("spc","play","PLAY",() => {start();});
    const canv = document.getElementById("gm");
    const ctx = canv.getContext("2d");
    board.ctx = ctx;
    const canv2 = document.getElementById("next");
    const nctx = canv2.getContext("2d");
    nctx.shadowColor = "#fff";
    nctx.shadowBlur = 30;
    board.nctx = nctx;

    const bstp = localStorage.getItem("bestp");
    if (bstp) {
        bestscore = parseInt(bstp);
        document.getElementById("bestp").innerHTML = bestscore;
    }
    const bstt = localStorage.getItem("bestt");
    if (bstt){
        besttime = bstt;
        document.getElementById("bestt").innerHTML = "tiempo: " + msToTime(besttime);
    }
    
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
        if (e.code === "ShiftLeft") board.change();
    }
});
    
//GAME FUNCTS
function start(){
    if (gs > 0) return pause();
    let btn = document.getElementById("play");
    if (!btn) btn = document.getElementById("continue");
    fade(btn,0,500,() => {btn.remove();});
    const next = document.getElementById("next");
    fade(next,1,1000,()=>{});
    if (gs == -1){
        board.clean();
        board.getNextTetro();
        board.addTetro();
    }
    gs = 1;    
    loop.start();
    time_loop.start();
}
function pause(){
    if (gs){
        loop.pause();
        time_loop.pause();
        let btn = document.getElementById("continue");
        if (btn) btn.remove();
        dBtn("spc","continue","CONTINUE",() => {start();});
    } else {
        loop.start();
        time_loop.start();
    }
    gs = gs == 0 ? 1 : 0;
}
function end(){
    loop.stop();
    time_loop.stop();
    gs = -1;
    dBtn("spc","continue","NEW_GAME",() => {start();});
    const next = document.getElementById("next");
    fade(next,0,1000,()=>{});
    if (bestscore < p) {
        bestscore = p;
        document.getElementById("bestp").innerHTML = bestscore;
        localStorage.setItem("bestp",bestscore);
    }
    p = 0;
    if (besttime < t && p > 0) {
        besttime = t;
        document.getElementById("bestt").innerHTML = msToTime(besttime);
        localStorage.setItem("bestt",besttime);
    }
    t = 0;
    document.getElementById("points").innerHTML = "puntos: ---";
    document.getElementById("time").innerHTML = "tiempo: -:--.-";
}

//INPUT FUNCTS
function fall(){
    const spd = document.getElementById("speed");
    spd.innerHTML = loop.speed + " b/s";
    board.down();
}
function acc(rows){
    loop.speed = (loop.speed * (1 + (0.02 * rows))).toFixed(2);
    p += Math.pow(2,rows) * 50;
    document.getElementById("points").innerHTML = "puntos: " + p;

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
}

function fade(elem,to,time,func){
    elem.disabled = to == 0;
    let it = Math.round(time/50);
    let part = 1/ it;
    part *= to? 1: -1; 
    let foo = setInterval(() => {
        let current = parseFloat(window.getComputedStyle(elem).opacity);
        current += part;
        elem.style.opacity = current;
        it--;
        if (it == 0){
            elem.style.opacity = to? 1 : 0;
            func();
            clearInterval(foo);
        }
    },50);
} //this has one use
function msToTime(number){
    const mm = Math.floor(number/600000);
    const ss = Math.floor((number%600000)/1000);
    const ms = Math.floor(number%1000);
    return mm + ":" +(ss < 10? '0' : '') + ss + "." + ms;
}