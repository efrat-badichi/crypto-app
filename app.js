const express = require('express');
const config = require("config"); 

const port = config.get("app.port"); 

// middlewares
const notFound = require('./middlewares/404')
const errorHandler = require('./middlewares/error')

// 
const guestsRoute = require('./routes/guests.routes');
const usersRoute = require('./routes/users.routes');
const githubRoute = require('./routes/github.routes');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', guestsRoute);
app.use('/', usersRoute);
app.use('/github', githubRoute);

app.use(errorHandler);
app.use(notFound);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})