const express = require('express');
const app = express();
require('dotenv').config();

let accountSid = process.env.accountSid;
let authToken = process.env.authToken;

let twilio = require('twilio');
let client = new twilio(accountSid, authToken);

app.get('/', function (req, res) {
  client.messages.create({
    body: 'Hello from Node',
    to: 'whatsapp:+2348088434514',
    from: "whatsapp:"+ process.env.TWILIO_NUMBER
})
.then((message) => console.log(message.sid));
  res.send('Hello World')
});

app.post('/callback', function (req, res) {
  console.log("Call Back")
  console.log(req,res);
  console.log("Call Back")
});

app.listen(process.env.PORT)
console.log(`App listening on ${process.env.PORT}`)