const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const ObjectId = require('mongoose').Types.ObjectId;
const { getTrendData } = require('./util/trends-collector.js');
const { User, Entry } = require('./data/models/models.js');
const { passport, pwdAuth, jwtAuth, jwtOptions } = require('./util/auth.js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');
const app = express();
const debug = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({secret: 'shhh, it\'s a secret', resave: false, saveUninitialized: true}));

if (debug) { app.get('*', function(req, res, next) { if (debug) { console.log('passing through url: ', req.url); } next(); }); }

app.get('/api/entries', jwtAuth(), function(req, res) {
  Entry.find({userId: ObjectId(req.user._id)}).limit(req.query.limit ? req.query.limit * 1 : 5).sort({datetime: -1}).exec()
    .then((entries) => res.status(200).json(entries)).catch(err => res.status(500).send('Server error: ', err));
});

app.post('/api/entries', jwtAuth(), function(req, res) {
  if (debug) { console.log('Entry post received, body is:'); }
  if (debug) { console.log(req.body); }
  let data = req.body;
  User.findOne({_id: ObjectId(req.user._id)}).then(user => {
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

app.get('/api/formconfig', jwtAuth(), function(req, res) {
  User.findOne({_id: ObjectId(req.user._id)}).then(user => {
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
// TODO: make this result data driven based on entries!
app.get('/api/outcomes', jwtAuth(), function(req, res) {
  User.findOne({_id: ObjectId(req.user._id)}).then(user => {
    let outcomes = _.pick(user, ['feelPhys', 'feelEmos', 'feelIlls']);
    res.status(200).json(outcomes);
  }).catch(err => res.status(500).send('Server error: ', err));
});

app.get('/api/trenddata', jwtAuth(), getTrendData);

app.post('/api/users/signup', function(req, res) {
  if (debug) { console.log('User signup received: ', req.body); }
  User.findOne({username: req.body.username}).then(user => {
    if (user) {
      res.status(422).send('Username already taken.');
    } else {
      let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      });
      return newUser.save();
    }
  }).then(() => res.status(201).send('User created'))
    .catch(err => res.status(500).send('Server error: ' + err));
});

app.post('/api/users/login', pwdAuth(), function(req, res) {
  const token = jwt.sign({username: req.body.username}, jwtOptions.secretOrKey);
  res.json({message: 'Login successfull, here\'s your JWT', token: token});
});

app.get('*', function(req, res) { // catch all route
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

const port = 3000;
app.listen(port);
console.log('Server now listening on port ' + port);
