import Tool from "./Tools";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.sendFigure('draw', {
            type: 'finish',
        })
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            const x = e.pageX - e.target.offsetLeft;
            const y = e.pageY - e.target.offsetTop;
            //this.draw(x, y);

            this.sendFigure('draw', {
                type: 'brush',
                x,
                y
            })
        }
    }

    static draw(ctx, x ,y) {
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}