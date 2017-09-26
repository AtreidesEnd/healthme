var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var handler = require('./handlers/route-handler');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('*', function(req, res, next) {
  console.log('passing through url: ', req.url);
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser('secretKey13'));
app.use(session({secret: 'shhh, it\'s a secret', resave: false, saveUninitialized: true}));

app.get('*', function(req, res) { // catch all route
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

var port = 3000;
app.listen(port);
console.log('Server now listening on port ' + port);
