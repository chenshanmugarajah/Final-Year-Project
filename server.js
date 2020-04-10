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

app.post('/login', async (req, res) => {
  let password = req.body.password
  let username = req.body.username
  let user = 'test';

  try {
    user = (await getUser(username)).Items[0]
  } catch {
    console.log('error')
  }

  if(typeof user == "undefined") {
    res.redirect('/register')
  } else {
    console.log(await bcrypt.compare(password, user.password));
  }

})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {

  let username = req.body.username
  let password = await bcrypt.hash(req.body.password, 10)

  try {
    user = (await getUser(username)).Items[0];
  } catch (err) {
    console.log('caught something :)')
  }

  if(typeof user !== "undefined") {
    res.redirect('/login')
    return;
  }

  let params = {
    TableName: 'RedUsers',
    Item: {
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
async function getUser(username) {
  let params = {
    TableName: 'RedUsers',
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {':username' : username}
  }

  let data  = await documentClient.scan(params, (err, data) => {
    if (err) console.log(err)
  }).promise()

  return data;
}