import React from 'react'
import './styles/app.scss'
import Toolbar from "./component/Toolbar";
import SettingBar from "./component/SettingBar";
import Canvas from "./component/Canvas";

import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

const App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route path='/:id'>
                        <Toolbar/>
                        <SettingBar/>
                        <Canvas/>
                    </Route>
                    <Redirect to={`f${Date.now()}`}/>
                </Switch>

            </div>
        </BrowserRouter>
    );
}

export default App;
