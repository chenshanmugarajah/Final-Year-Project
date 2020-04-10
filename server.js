const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000)

// change to database
const users = []

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', (req, res) => {
  let password = req.body.password
  console.log(password)
})