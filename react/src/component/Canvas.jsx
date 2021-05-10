import React, {useEffect, useRef, useState} from 'react';
import classes from'../styles/canvas.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useParams} from 'react-router-dom'
import axios from "axios";


const Canvas = observer(() => {

    const canvasRef = useRef();
    const inputRef = useRef();
    const [modal, setModal] = useState(true)
    const params = useParams();

    useEffect(async () => {
        canvasState.setCanvas(canvasRef.current);
        await axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(res => {
                const img = new Image();
                const ctx = canvasRef.current.getContext('2d')
                img.src = res.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            })
            .catch(err => console.log(err))

    }, []);

    useEffect(() => {
        if (canvasState.userName) {
            const socket = new WebSocket('ws://localhost:5000/');

            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);

            toolState.setTool(new Brush(canvasRef.current, socket, params.id));

            socket.onopen = () => {
                console.log('подключение установлено');
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.userName,
                    method: 'connection'
                }))
            }
            socket.onmessage = (e) => {
                const msq = JSON.parse(e.data);
                switch (msq.method) {
                    case 'connection':
                        console.log(`Пользователь ${msq.username} подключен`);
                        break
                    case 'draw':
                        drawHandler(msq);
                        break
                }
            }
        }
    }, [canvasState.userName]);

    const drawHandler = (msq) => {
        const figure = msq.figure;
        const ctx = canvasRef.current.getContext('2d');

        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case 'finish':
                ctx.beginPath();
                break
        }
    }

    const mouseDownHandler = async () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
    }

    const mouseUpHandler= async () => {
        await axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    const connectionHandler = () => {
        if (inputRef.current.value !== '') {
            canvasState.setUserName(inputRef.current.value);

            setModal(false)
        }
    }

    return (
        <div className={classes.canvas}>

            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" placeholder='Введите имя' ref={inputRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas ref={canvasRef}
                    onMouseDown={() => mouseDownHandler()}
                    onMouseUp={() => mouseUpHandler()}
                    width={600}
                    height={400}/>
        </div>
    );
});

export default Canvas;