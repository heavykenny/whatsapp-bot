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
  const {body} = req;
  const {request} = body;
  const param = request.Body;
  let incomingUser;

  incomingUser = User.exists({number: request.From}, function (err, doc) {
    if (err) console.log(err);
    if (!doc) {
      let newUser = new User({
        number: request.From,
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
    message(helper.GREETINGS_RELIES[Math.floor(Math.random() * helper.GREETINGS_RELIES.length)], request.From);
  }
  setTimeout(function () {
    findUser(request.From).then(dbUser => {
      if (dbUser[0].course_asked === '0') {
        User.findByIdAndUpdate(dbUser,
          {course_asked: 1}, function (err, docs) {
            if (err) console.log(err);
          });
        message(helper.QUESTIONS["first"], dbUser.number);
      }
      if (dbUser[0].course_asked === '1' && dbUser[0].course === '0') {
        User.findByIdAndUpdate(dbUser,
          {course: param, university_asked: 1}, function (err, docs) {
            if (err) console.log(err);
          });
        message(helper.QUESTIONS["second"], dbUser.number);
      }
      if (dbUser[0].university_asked === '1' && dbUser[0].university === '0') {
        User.findByIdAndUpdate(dbUser,
          {university: param}, function (err, docs) {
            if (err) console.log(err);
            message("Thank You.", dbUser.number);
            message(helper.REPLIES['options'], dbUser.number);
          });
      }
      if (param === "1") {
        findUser(request.From).then(dbUser => {
          let m = "University: "+ dbUser[0].university+ "\nCourse: "+ dbUser[0].course;
          message(m, dbUser.number);
        });
      }
    }).catch(error => console.error(error));
  }, 3000)

  return res.send({requestBody: 'empty'});
});

app.listen(process.env.PORT)
console.log(`App listening on ${process.env.PORT}`)