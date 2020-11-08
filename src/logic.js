let accountSid = process.env.accountSid;
let authToken = process.env.authToken;

let twilio = require('twilio');
let client = new twilio(accountSid, authToken);
const fs = require('fs');

exports.GREETINGS = [
  "hi", "hello", "what's up", "hey", "hay"
];

exports.GREETINGS_RELIES = [
  "How are you! This is a Bot, Start by Answering these questions", "What's Up!, This is a Bot, Start by Answering these questions",
];

exports.QUESTIONS = {
  first: "Which course are you doing?",
  second: "Which university?"
}

exports.REPLIES = {
  welcome: `Welcome to UoN 🙌`,
  options: `WHAT WOULD YOU LIKE TO DO?
     1. View Details ⚖
     To make a selection, reply with the number ONLY of your option.
     EXAMPLE: Reply with 1 to View Details ⚖`
}

exports.sendMessage = (body, to) => {
  client.messages.create({
    body: body,
    to: 'whatsapp:' + to,
    from: "whatsapp:" + process.env.TWILIO_NUMBER
  });
}

