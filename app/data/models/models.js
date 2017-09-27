var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var url = 'mongodb://127.0.0.1:27017/healthme';

const userConfigDefaults = {
  allergens: ['Gluten', 'Rice', 'Yeast', 'Dairy', 'Fruits', 'Vegetables',
    'Red meat', 'Poultry', 'Seafood', 'Sugar / Sweets', 'Beer', 'Wine',
    'Liquor - Dark', 'Liquor - Light'],
  preps: ['Fresh', 'ReadyMade', 'Restaurant', 'Fried',
    'Grilled', 'Baked', 'Greasy'],
  actTypes: ['Running / Cardio', 'Biking', 'Walking',
    'Yoga', 'Zumba / Dance', 'Strength', 'Weights'],
  actInts: ['High', 'Medium', 'Low'],
  feelPhys: ['Stomach Ache', 'Stomach Cramps', 'Bloated',
    'Headache', 'Sore', 'Great All Around', 'Tired', 'Hungry'],
  feelEmos: ['Happy / Well-balanced', 'Sad / Depressed',
    'Nervous / Stressed', 'Grumpy', 'Bored / Unmotivated'],
  feelIlls: ['Cold', 'Sore Throat', 'Cough', 'Indigestion', 'Fever'],
  dailyMoveTarget: 60
};

userSchema = new mongoose.Schema(
  {
    username: {type: String, unique: true},
    // TODO: fix this -> need to support emails as unique but only if provided!
    // email: {type: String, unique: true, trim: true, index: true, sparse: true},
    password: String,
    gender: String,
    age: Number,
    allergens: Array,
    preps: Array,
    actTypes: Array,
    actInts: Array,
    feelPhys: Array,
    feelEmos: Array,
    feelIlls: Array,
    dailyMoveTarget: Number
  },
  {timestamps: true}
);

userSchema.pre('save', function(next) {
  // setup the default user config
  this.allergens = userConfigDefaults.allergens;
  this.preps = userConfigDefaults.preps;
  this.actTypes = userConfigDefaults.actTypes;
  this.actInts = userConfigDefaults.actInts;
  this.feelPhys = userConfigDefaults.feelPhys;
  this.feelEmos = userConfigDefaults.feelEmos;
  this.feelIlls = userConfigDefaults.feelIlls;
  this.dailyMoveTarget = userConfigDefaults.dailyMoveTarget;
  return bcrypt.hash(this.password, 10).then(hash => {
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

entrySchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    datetime: Date,
    title: String,
    desc: String,
    details: mongoose.Schema.Types.Mixed
  }
);

module.exports.User = mongoose.model('User', userSchema);
module.exports.Entry = mongoose.model('Entry', entrySchema);
mongoose.connect(url);
module.exports.mongoose = mongoose;
