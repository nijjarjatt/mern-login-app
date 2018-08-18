//Package imports
const express = require('express');
const app = express.Router();

app.use('/', require('./authenticate'));
app.use('/', require('./user'));

module.exports = app;
