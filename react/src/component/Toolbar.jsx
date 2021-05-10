import React from 'react';
import classes from '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import {observer} from "mobx-react-lite";

const Toolbar = observer(() => {

    const changeColor = (e) => {
        toolState.setFillColor(e.target.value);
        toolState.setStrokeColor(e.target.value);
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionId + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className={classes.toolbar}>
            <button className={`${classes.toolbar__btn} ${classes.brush}`} onClick={()=> toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className={`${classes.toolbar__btn} ${classes.rect}`} onClick={()=> toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
            <button className={`${classes.toolbar__btn} ${classes.circle}`} onClick={()=> toolState.setTool(new Circle(canvasState.canvas))}></button>
            <button className={`${classes.toolbar__btn} ${classes.eraser}`} onClick={()=> toolState.setTool(new Eraser(canvasState.canvas))}></button>
            <button className={`${classes.toolbar__btn} ${classes.line}`} onClick={()=> toolState.setTool(new Line(canvasState.canvas))}></button>
            <input onChange={e => changeColor(e)} type="color"/>
            <button className={`${classes.toolbar__btn} ${classes.undo}`} onClick={() => canvasState.undo()} disabled={canvasState.undoList.length === 0}></button>
            <button className={`${classes.toolbar__btn} ${classes.redo}`} onClick={() => canvasState.redo()} disabled={canvasState.redoList.length === 0}></button>
            <button className={`${classes.toolbar__btn} ${classes.save}`} title="Сохранить" onClick={() => download()}></button>
        </div>
    );
});

export default Toolbar;