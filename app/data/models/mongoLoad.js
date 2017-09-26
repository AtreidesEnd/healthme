var {User, mongoose} = require('./models.js');
var {Entry} = require('./models.js');

var defaultUser = new User({
  username: 'user1',
  email: 'user@example.com',
  gender: 'male', age: '25',
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
});

defaultUser.save()
  .then((res) => mongoose.disconnect())
  .catch((err) => {
    console.log(err);
    mongoose.disconnect();
  });
