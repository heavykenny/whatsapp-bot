let accountSid = process.env.accountSid;
let authToken = process.env.authToken;

let twilio = require('twilio');
let client = new twilio(accountSid, authToken);
const fs = require('fs');

exports.GREETINGS = [
  "hi", "hello", "what's up", "hey", "hay"
];

exports.GREETINGS_RELIES = [
  "How are you!", "What's Up!",
];

exports.QUESTIONS = {
  first: "Which course are you doing?",
  second: "Which university?"
}

exports.REPLIES = {
  welcome: `Welcome to UoN 🙌`,
  options: "WHAT WOULD YOU LIKE TO DO? \n 1. View Details ⚖ \n To make a selection, reply with the number ONLY of your option. \nEXAMPLE: Reply with 1 to View Details ⚖"
}

exports.sendMessage = (body, to) => {
  console.log("SENDING MESSAGE to " + to)
  return client.messages.create({
    body: body,
    to: to,
    from: "whatsapp:" + process.env.TWILIO_NUMBER
  });
}

