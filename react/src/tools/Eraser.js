import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(canvas) {
        super(canvas);
        this.listen();
    }

    draw(x ,y) {
        this.ctx.lineTo(x,y);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
    }
}