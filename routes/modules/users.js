const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  // console.log(req.flash('error')) 可印出但無法儲存
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此信箱已被註冊。' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位皆為必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符。' })
    }
    if (errors.length) {
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('register_msg', '註冊成功，請重新登入。')
        res.redirect('/users/login')
      })
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('logout_msg', '您已成功登出。')
  res.redirect('/users/login')
})

module.exports = router