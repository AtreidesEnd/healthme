const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const handler = require('./handlers/route-handler');
const { User, Entry } = require('./data/models/models.js');
const _ = require('lodash');
const app = express();
var debug = true;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.get('*', function(req, res, next) { if (debug) { console.log('passing through url: ', req.url); } next(); });

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser('secretKey13'));
app.use(session({secret: 'shhh, it\'s a secret', resave: false, saveUninitialized: true}));

app.get('/api/entries', function(req, res) {
  Entry.find().then((entries) => res.status(200).json(entries));
});

app.post('/api/entries', function(req, res) {
  if (debug) { console.log('Entry post received, body is:'); }
  if (debug) { console.log(req.body); }
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

app.get('/api/formconfig', function(req, res) {
  let username = req.query.username || 'user1';
  User.findOne({username: username}).then(user => {
    let config;
    if (req.query.type === 'activity') {
      config = _.pick(user, ['actTypes', 'actInts']);
    } else if (req.query.type === 'daily') {
      config = _.pick(user, ['dailyMoveTarget']);
    } else if (req.query.type === 'feeling') {
      config = _.pick(user, ['feelPhys', 'feelEmos', 'feelIlls']);
    } else if (req.query.type === 'meal') {
      config = _.pick(user, ['allergens', 'preps']);
    }
    if (debug) { console.log('Sending form config for form: ', req.query.type, ' with data: '); }
    if (debug) { console.log(config); }
    res.status(200).json(config);
  }).catch(err => res.status(500).send('Server error: ', err));

});

app.get('*', function(req, res) { // catch all route
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

var port = 3000;
app.listen(port);
console.log('Server now listening on port ' + port);
