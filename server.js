const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

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
      username: username,
      password: password
    }
  }

  let user = '';

  documentClient.get(params, (err, data) => {
    if (err) console.log(err)
    else {
      console.log(data.size)
    }
  })

})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', (req, res) => {
  let password = req.body.password
  let username = req.body.username

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