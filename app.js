process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const express = require('express');
const config = require("config"); 
const path = require('path');

const port = config.get("app.port"); 

// middlewares
const notFound = require('./middlewares/404')
const errorHandler = require('./middlewares/error')
const mysql = require('./middlewares/mysql')

// routes
const guestsRoute = require('./routes/guests.routes');
const usersRoute = require('./routes/users.routes');
const githubRoute = require('./routes/github.routes');

// config app
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// declare socker server 
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`a user connected`);
    socket.on('CurrencyUpdated', (msg) => {
        io.emit('symbol value update', msg);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// config db
app.use(mysql);

app.use('/', guestsRoute);
app.use('/', usersRoute);
app.use('/github', githubRoute);

app.use(errorHandler);
app.use(notFound);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})