const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dataBase = require('./db/index');
const indexRouter = require('./routes/index');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const fs = require("fs");
//view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger((tokens, req, res)=>{
    console.log(
        tokens.method(req, res)+" "+
        tokens.url(req, res)+" "+
        tokens.status(req, res)+" "
    );
    console.log(req.body)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
   res.render('error');
});

app.use(morgan(function (tokens, req, res) {
    if (req.method === 'GET'){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            `date - ${new Date()}`,
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.query),
            JSON.stringify(req.data)
        ].join(' ')
    } else {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            `date - ${new Date()}`,
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body),
            JSON.stringify(req.data),
        ].join(' ')
    }
}, {stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })}));


dataBase.authenticate()
    .then(() => {console.log('Connected to DB')})
    .catch(error => console.log('DB connecting error '+error));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
