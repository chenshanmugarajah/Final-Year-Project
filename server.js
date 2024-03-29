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
app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs')
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }))
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
//DocumentClient created to store data
const documentClient = new AWS.DynamoDB.DocumentClient()

//GET routes
app.get('/', checkAuthenticated, async (req, res) => {
  const user = (await req.user).Items[0]
  res.render('index.ejs', {username : user.username} )
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, checkConsent, (req, res) => {
  if (consent.data && consent.participation) {
    res.render('register.ejs')
  } else {
    res.redirect('/data-consent')
  }
})

app.get('/data-consent', (req, res) => {
  res.render('data-consent.ejs')
})

app.get('/participation-consent', (req, res) => {
  res.render('data.participation.ejs')
})

app.get('/voting', checkAuthenticated, async (req, res) => {
  const user = (await req.user).Items[0]
  res.render('voting.ejs', {username: user.username})
})

app.get('/emotion', checkAuthenticated, async (req, res) => {
  const user = (await req.user).Items[0]
  res.render('emotion.ejs', {username: user.username})
})

app.get('/results', checkAuthenticated, (req, res) => {
  res.render('results.ejs')
})

//POST routes
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
          password: hashedpassword,
          louder: 0,
          clearer: 0,
          slower: 0,
          explane: 0,
          faster: 0,
          breaktime: 0,
          goback: 0,
          question: 0,
          emotion: "neutral"
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

app.post('/data-consent', (req, res) => {
  consent.data = true;
  res.redirect('/participation-consent')
})

app.post('/participation-consent', (req, res) => {
  consent.participation = true;
  console.log(consent)
  res.redirect('/register')
})

app.post('/emotion', (req, res) => {
  console.log('posting accepted from server.js')
})

//Route override for logout
app.delete('/logout', (req, res) => {
  req.logOut()
  consent.data = false
  consent.participation = false
  res.redirect('/login')
})

//Server
app.listen(3000, () => {
  console.log('Server started: http://localhost:3000')
})

//Get user from dynamodb
async function getUser(username) {
  let params = {
    TableName: 'RedUsers',
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {':username' : username}
  }
  let data  = await documentClient.scan(params, (err, data) => {
    if (err) console.log(err)
  }).promise()

  //Return data as a promise
  return data;
}

//Check if logged in, to disallow pages
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

//Check if not logged in, to disallow login and register pages
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

//Consent 
let consent = {
  data: false,
  participation: false
}

//Checking consent has been given
function checkConsent(req, res, next) {
  if(consent.data == false) {
    res.redirect('/data-consent')
  } else if (consent.participation == false) {
    res.redirect('/participation-consent')
  } else {
    return next();
  }
}