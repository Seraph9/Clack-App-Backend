const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const cors = require("cors")

const app = express();
const usersRouter = require('./routes/users');
const channelsRouter = require('./routes/channels');
const messagesRouter = require('./routes/messages');
const { environment } = require('./config');

app.set('view engine', 'pug');
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "https://clackapp.herokuapp.com/" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/', messagesRouter);

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
    const error = new Error("The requested resource couldn't be found.");
    error.status = 404;
    next(error);
});

// Custom error handlers.

// Generic error handler.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        stack: isProduction ? null : err.stack
    });
});



module.exports = app;