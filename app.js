const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

// Settings 
app.set('port', 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use(require('./routes/index'));

// Static 
console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;

// 404 handler
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});