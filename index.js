const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser);

let accountSid = process.env.accountSid;
let authToken = process.env.authToken;

let twilio = require('twilio');
let client = new twilio(accountSid, authToken);

app.get('/', function (req, res) {
  client.messages.create({
    body: 'Hello from',
    to: 'whatsapp:+2348088434514',
    from: "whatsapp:"+ process.env.TWILIO_NUMBER
})
.then((message) => console.log(message.sid));
  res.send('Hello World');
});

app.post('/callback', function (req, res) {
  if(req.body == "Hi"){
    res.json({requestBody: "Gotha!"});
  }
  res.json({requestBody: req.body});
});

app.listen(process.env.PORT)
console.log(`App listening on ${process.env.PORT}`)