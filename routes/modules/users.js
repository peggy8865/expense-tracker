const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  
  if (!name || !email || !password || !confirmPassword) {
    return console.log('所有欄位為必填。')
  }
  User.findOne({ email }).then(user => {
    if (user) {
      return console.log('此信箱已被註冊。')
    } else if (password !== confirmPassword) {
      return console.log('密碼與確認密碼不相符。')
    } else {
      User.create({ name, email, password }).then(() =>{
        res.redirect('/users/login')
      }).catch(err => console.log(err))
    }
  }).catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router