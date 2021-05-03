import React from 'react';
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Толщина линии</label>
            <input onChange={e => toolState.setLineWidth(e.target.value)}
                   style={{margin: '0 10px'}}
                   id="line-width"
                   type="number"
                   min={1}
                   max={50}
                   defaultValue={1}/>

            <label htmlFor="stroke-color">Цвет обводки</label>
            <input onChange={e => toolState.setStrokeColor(e.target.value)}
                   id="stroke-color"
                   style={{margin: '0 10px'}}
                   type="color"/>
        </div>
    );
};

export default SettingBar;