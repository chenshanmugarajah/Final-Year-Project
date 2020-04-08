require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.get('/register', (req, res) => {
 res.render('register.ejs');
})

app.listen(3000, console.log('Server started on port 3000'))