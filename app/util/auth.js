const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const { User } = require('../data/models/models.js');
const debug = false;

// ====== Passport Utilities Setup ====== \\
passport.serializeUser((user, done) => {
  if (debug) { console.log('Serializing with: ', user); }
  done (null, user.username);
});

passport.deserializeUser((username, done) => {
  if (debug) { console.log('Deserializing with: ', username); }
  User.findOne({username: username})
    .then(user => done(null, user))
    .catch((err) => console.log(err));
});

// ====== JWT Strategy Setup ====== \\
module.exports.jwtOptions = jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'fearIsTheMindKiller13',
};

passport.use(new JwtStrategy(jwtOptions, function(jwtPayload, done) {
  console.log('jwt token payload received', jwtPayload);
  User.findOne({username: jwtPayload.username}).then(user => {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));
module.exports.jwtAuth = () => passport.authenticate('jwt', {session: false});

// ====== Local Strategy Setup ====== \\
passport.use(new LocalStrategy(function(username, password, done) {
  if (debug) { console.log('Authenticating via local strategy'); }
  if (debug) { console.log('username: ', username, ' password: ', password); }
  User.findOne({username: username}).then(user => {
    if (user) {
      return user.comparePassword(password).then(match => {
        if (match) {
          done(null, user);
        } else {
          done(null, false, {messages: 'Incorrect password'});
        }
      });
    } else {
      done(null, false, {messages: 'User not found'});
    }
  }).catch(err => console.log(err));
}));
module.exports.pwdAuth = () => passport.authenticate('local', {session: false});
module.exports.passport = passport;
