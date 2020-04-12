if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// consts
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const AWS = require('aws-sdk')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

// passport set up
const initializePassport = require('./passport-config')
initializePassport(passport, email => getUser(email))

// app set up
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view-engine', 'ejs')
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// AWS config
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
})
const documentClient = new AWS.DynamoDB.DocumentClient()

// routes
app.get('/', checkAuthenticated, async (req, res) => {
  const user = (await req.user).Items[0]
  res.render('index.ejs', {username : user.username} )
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {

  let username = req.body.username
  let password = req.body.password
  let hashedpassword = await bcrypt.hash(password, 10)

  try {
    user = (await getUser(username)).Items[0];

    if (typeof user !== "undefined") {
      res.redirect('/login')
      return;
    } else {
      let params = {
        TableName: 'RedUsers',
        Item: {
          username: username,
          password: hashedpassword
        }
      };
    
      documentClient.put(params, (err, data) => {
        if (err) console.log(err)
        else res.redirect('/login')
      });
    }

  } catch (err) {
    console.log('caught something :)')
  }

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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// server
app.listen(3000)