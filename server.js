var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

require("./server/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);