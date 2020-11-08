const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const helper = require('./src/logic.js');
const uri = process.env.MONGO_DB;
const mongoose = require('mongoose');
require('./database/models');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const User = mongoose.model('User');

function findUser(number) {
  return User.find({number: number}, function (err, results) {
    if (err) throw err;
    return results;
  });
}

app.get('/', function (req, res) {
  // helper.sendMessage("Hello from", "+2348088434514");
  res.send('Hello World');
});

app.post('/callback', (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const param = obj.Body;
  const from = obj.From;
  let incomingUser;
  incomingUser = User.exists({number: from}, function (err, doc) {
    if (err) console.log(err);
    if (!doc) {
      let newUser = new User({
        number: from,
        university: 0,
        university_asked: 0,
        course: 0,
        course_asked: 0
      });
      newUser.save((err, result) => {
        if (err) console.log(err);
        return incomingUser = result;
      });
    }
  });

  const stringData = helper.GREETINGS;
  const questions = helper.QUESTIONS;
  const message = helper.sendMessage;

  if (new RegExp(stringData.join("|")).test((param.toLowerCase()))) {
    message(helper.GREETINGS_RELIES[Math.floor(Math.random() * helper.GREETINGS_RELIES.length)], from);
  }
  setTimeout(function () {
    findUser(from).then(dbUser => {
      if (dbUser[0].course_asked === '0') {
        User.findByIdAndUpdate(dbUser,
          {course_asked: 1}, function (err, docs) {
            if (err) console.log(err);
          });
        message(helper.QUESTIONS["first"], from);
      }
      if (dbUser[0].course_asked === '1' && dbUser[0].course === '0') {
        User.findByIdAndUpdate(dbUser,
          {course: param, university_asked: 1}, function (err, docs) {
            if (err) console.log(err);
          });
        message(helper.QUESTIONS["second"], from);
      }
      if (dbUser[0].university_asked === '1' && dbUser[0].university === '0') {
        User.findByIdAndUpdate(dbUser,
          {university: param}, function (err, docs) {
            if (err) console.log(err);
            message("Thank You.", from);
            message(helper.REPLIES['options'], from);
          });
      }
      if ((dbUser[0].course).length > 1 && (dbUser[0].university).length > 1) {
        message("Thank You.", from);
        message(helper.REPLIES['options'], from);
      }
      if (param === "1") {
        findUser(from).then(dbUser => {
          let m = "University: "+ dbUser[0].university+ "\nCourse: "+ dbUser[0].course;
          message(m, from);
        });
      }
    }).catch(error => console.error(error));
  }, 5000);
  return res.send({obj});
});

app.listen(process.env.PORT)
console.log(`App listening on ${process.env.PORT}`)