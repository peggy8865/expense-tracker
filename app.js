const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
require('./helper')

const PORT = process.env.PORT

app.get('/', (req, res) => {
  // 尚未標記 user
  let totalAmount = 0
  let promiseArray = []
  const categories = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  
  Record.find().sort({ date: -1 })
    .lean()
    .then(records => {
      records.forEach(record => {
        totalAmount = totalAmount + record.amount 
        record.date = record.date.toLocaleDateString()

        const promise = Category.findById(record.categoryId).then(item => {
          record.category = item.name
        })
        promiseArray.push(promise)
        
      })
      Promise.all(promiseArray).then(() => {
        res.render('index', { totalAmount, records, categories })
      })
    })
    .catch(err => console.log(err))
})

app.get('/records/new', (req, res) => {
  const categories = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  res.render('new', { categories })
})

app.post('/records', (req, res) => {
  // 尚未標記 user
  const { name, date, amount, category } = req.body
  Category.findOne({ name: category })
    .then(item => {
      const categoryId = item._id
      Record.create({ name, date, amount, categoryId })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})