const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT
const routes = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.logout_msg = req.flash('logout_msg')
  res.locals.login_warning_msg = req.flash('login_warning_msg')
  res.locals.register_msg = req.flash('register_msg')
  res.locals.login_err_msg = req.flash('error') // 暫行作法
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})