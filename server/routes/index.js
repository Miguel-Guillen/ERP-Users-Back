const express = require('express');
const app = express();

app.use('/project', require('./project'));
app.use('/task', require('./task'));
app.use('/employee', require('./employee'));
app.use('/login', require('./login'));

module.exports = app;