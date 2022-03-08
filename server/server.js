require('./config/config');

const hostname = '127.0.0.1';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const logFile = fs.createWriteStream(__dirname + '/status.log', { flags: 'a' })
// const opcionesGet = require('./middlewares/opcionesGet');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control.Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(bodyParser.json());
app.use(morgan({ stream: logFile }))
// app.use(opcionesGet);
app.use('/api', require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then((resp) => {
    console.log('[SERVER]', `Base de datos online en ${process.env.URLDB}`);
}).catch((err) => {
    console.log('[SERVER]', `Conexion fallida: ${err}`);
});

app.use((req, res) => {
    return res.status(404).send({
        resp: '404',
        err: true,
        msg: `URL ${req.url} Not Found`,
        cont: {}
    });
});

server = app.listen(process.env.PORT, hostname, () => {
    console.log('[SERVER]', `running at http://${hostname}:${process.env.port}`);
});