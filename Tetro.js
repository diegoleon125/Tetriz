/*
 * Clase de los bloques
 * Autor: Diego León
 */
export class Tetro {
    constructor(num){
        this.x = 4;
        this.y = 0;
        this.obj;
        this.num = num;
        switch (num){
            case 1: this.obj = [[0,1,0],[0,1,1],[0,0,1]]; this.x = 3; break;
            case 2: this.obj = [[0,2,0],[2,2,0],[2,0,0]]; break;
            case 3: this.obj = [[0,3,0],[0,3,0],[0,3,3]]; this.x = 3; break;
            case 4: this.obj = [[0,4,0],[0,4,0],[4,4,0]]; break;
            case 5: this.obj = [[0,0,0],[5,5,5],[0,5,0]]; ;this.y = -1; break;
            case 6: this.obj = [[0,0,0],[0,6,6],[0,6,6]]; this.x = 3;this.y = -1; break;
            default: this.obj = [[0,7,0,0],[0,7,0,0],[0,7,0,0],[0,7,0,0]]; break;
        }
    }
}