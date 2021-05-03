import {makeAutoObservable} from "mobx";

class CanvasState {
    canvas = null;
    socket = null;
    sessionId = null;
    userName = '';
    undoList = [];
    redoList = [];

    constructor() {
        makeAutoObservable(this)
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setUserName(name) {
        this.userName = name;
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    undo() {
        this.draw('undoList', 'pushToRedo');
    }

    redo() {
        this.draw('redoList', 'pushToUndo');
    }

    draw(action, actionPush) {
        const ctx = this.canvas.getContext('2d');
        if (this[action].length > 0) {
            const dataUrl = this[action].pop();
            this[actionPush](this.canvas.toDataURL());
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }
}

export default new CanvasState()