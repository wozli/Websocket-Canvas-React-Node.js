const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const fs = require('fs');
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log('Подключено сервер');

    ws.send('Ты успешно подключился')

    ws.on('message', (msq) => {

        msq = JSON.parse(msq);

        switch (msq.method) {
            case 'connection':
                connectionHandler(ws, msq);
                break
            case 'draw':
                broadcastConnection(ws, msq);
                break
        }
    })
})

app.post('/image', (req,res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '');
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
        return res.status(200).json({message: 'успешно'})
    } catch (e) {
        console.log(e);
        return res.status(500).json('error')
    }
})
app.get('/image', (req,res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
        const data = `data:image/png;base64,${file.toString('base64')}`;
        res.json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json('error')
    }
})

app.listen(PORT, () => console.log(`server start port: ${PORT}`))

const connectionHandler = (ws, msq) => {
    ws.id  = msq.id;
    broadcastConnection(ws, msq);
}

const broadcastConnection = (ws, msq) => {
    aWss.clients.forEach(client => {
        if (client.id === msq.id) {
            client.send(JSON.stringify(msq))
        }

    })
}