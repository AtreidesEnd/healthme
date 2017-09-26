var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt'); //someday...

var url = 'mongodb://127.0.0.1:27017/healthme';

userSchema = new mongoose.Schema(
  {
    username: {type: String, unique: true},
    email: {type: String, unique: true, trim: true, index: true, sparse: true},
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
