var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var handler = require('./handlers/route-handler');
var { User, Entry } = require('./data/models/models.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.get('*', function(req, res, next) { console.log('passing through url: ', req.url); next(); });

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser('secretKey13'));
app.use(session({secret: 'shhh, it\'s a secret', resave: false, saveUninitialized: true}));

app.get('/api/entries', function(req, res) {
  Entry.find().then((entries) => res.status(200).json(entries));
});

app.post('/api/entries', function(req, res) {
  console.log('Entry post received, body is:');
  console.log(req.body);
  let data = req.body;
  User.findOne({username: 'user1'}).then(user => {
    let userId = user._id;
    let newEntry = new Entry({
      type: data.type,
      title: data.title, desc: data.desc, datetime: data.datetime,
      userId: userId, details: data.details
    });
    return newEntry.save()
      .then(() => res.status(201).send('entry created'));
  }).catch((err) => res.status(500).send('Server error: ', err));
});


app.get('*', function(req, res) { // catch all route
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

var port = 3000;
app.listen(port);
console.log('Server now listening on port ' + port);
