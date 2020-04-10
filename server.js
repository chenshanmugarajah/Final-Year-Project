const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

// app set up
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view-engine', 'ejs')

// server
app.listen(3000)

const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})
const documentClient = new AWS.DynamoDB.DocumentClient()

// routes
app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {
  let password = req.body.password
  let username = req.body.username

  let params = {
    TableName: 'RedUsers',
    Key: {
      username: username
    }
  }

  documentClient.get(params, (err, data) => {
    if (err) console.log(err)
    if (JSON.stringify(data) == '') console.log('no user')
    else console.log(data)
  })

})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {
  let password = await bcrypt.hash(req.body.password, 10)
  let username = req.body.username
  let id = generateRowId(4);

  let result = await getUser(id, username, req.body.password);
  
  let json = JSON.stringify(result);

  if (json !== "{}") {
    res.redirect('/login')
    return
  }

  let params = {
    TableName: 'RedUsers',
    Item: {
      id: id,
      username: username,
      password: password
    }
  }

  documentClient.put(params, (err, data) => {
    if (err) console.log(err)
    else res.redirect('/login')
  })

})

// get user from dynamodb
async function getUser(id, username, password) {

  let params = {
    Key: {
      id: id,
      username: username
    },
    TableName: "RedUsers"
  }

  return await documentClient.get(params).promise();
}

// unique id
let CUSTOMEPOCH = 1300000000000; // artificial epoch
function generateRowId(shardId /* range 0-64 for shard/slot */) {
  let ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
  let randid = Math.floor(Math.random() * 512);
  ts = (ts * 64);   // bit-shift << 6
  ts = ts + shardId;
  return (ts * 512) + (randid % 512);
}