const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')

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

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
  } catch {
    
  }
})

app.listen(3000)