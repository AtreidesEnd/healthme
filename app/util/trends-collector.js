const _ = require('lodash');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const { User, Entry } = require('../data/models/models.js');

const outcomeMap = {
  'Physical': 'details.physicals',
  'Emotional': 'details.emotionals',
  'Illness': 'details.ills'};

module.exports.getTrendData = (req, res) => {
  const username = req.query.username || 'user1';
  const outcomeQuery = JSON.parse(req.query.outcome);
  const outcome = outcomeQuery.text;
  const outcomeType = outcomeMap[outcomeQuery.group];
  let userId = null;
  let sourceEntries = null;
  User.findOne({username: username}).then(user => (userId = new ObjectId(user._id)))
    .then(() => {
      return Entry.find({userId: userId, [outcomeType]: outcome });
    }).then(entries => {
      let subqs = [];
      sourceEntries = entries;
      let duration = moment.duration(4, 'hours');
      sourceEntries.forEach(entry => {
        let entryTime = moment(entry.datetime);
        let startTime = moment(entryTime).subtract(duration);
        subqs.push(Entry.find({userId: userId})
          .where('datetime').gte(startTime).lte(entryTime).exec());
      });
      return Promise.all(subqs);
    }).then(qs => {
      let qset = _.uniqBy(_.flatten(qs), a=>a._id.toString());
      let trendData = {
        drivers: {},
        sleep: {sum: 0, count: 0},
        water: {sum: 0, count: 0},
        move: {sum: 0, count: 0},
        overall: {sum: 0, count: 0},
      };
      qset.forEach(entry => {
        if (entry.type === 'Meal') {
          entry.details.allergens.forEach(a => driverInc(a, trendData));
          entry.details.preps.forEach(a => driverInc(a, trendData));
        } else if (entry.type === 'Activity') { // TODO: look into concat'ing actType and intensity below
          entry.details.activityTypes.forEach(a => driverInc(a, trendData));
          entry.details.activityTypes.forEach(a => driverInc(a, trendData));
        } else if (entry.type === 'Daily' || entry.type === 'Feeling') {
          ['move', 'sleep', 'water', 'overall'].forEach(attr => driverSumInc(entry, attr, trendData));
        }
      });
      trendData.drivers = _.sortBy(_.map(trendData.drivers, (v, k) => [k, v]), arr => arr[1] * -1);
      ['move', 'sleep', 'water', 'overall'].forEach(attr => convToAvg(attr, trendData));
      if (req.query.includeRaw) {
        trendData.raw = {linkedEntries: qset, sourceEntries: sourceEntries};
      }
      res.status(200).json(trendData);
    }).catch(err => console.log(err));
};

const driverInc = (d, trendData) => {
  if (trendData.drivers[d]) {
    trendData.drivers[d]++;
  } else {
    trendData.drivers[d] = 1;
  }
};

const driverSumInc = (entry, attr, trendData) => {
  if (entry.details[attr]) {
    trendData[attr].sum += entry.details[attr];
    trendData[attr].count++;
  }
};

const convToAvg = (attr, trendData) => {
  trendData[attr] = trendData[attr].count ?
    trendData[attr].sum / trendData[attr].count : null;
};
