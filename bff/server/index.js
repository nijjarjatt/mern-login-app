const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const cors = require('cors');
const db = mongoose.connection;

const serverAddress = "mongodb://127.0.0.1:27017/login";

mongoose.connect(serverAddress);

db.on('error', console.error.bind(console, 'Mongoose Db Connection Error'));
db.once('open', () => {
    console.log('Db Connected on: ' + serverAddress);

    //Adding CORS for local testing, should be removed if in prod
    app.use(cors());
    app.use('/', require('./routes'));
    app.listen(3000, () => console.log('Server is now running at port 3000'));
});

module.exports = app;
