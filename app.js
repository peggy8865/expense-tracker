const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
require('./helper')
const tool = require('./tool')

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

app.get('/records/:id/edit', (req, res) => {
  // 尚未標記 user
  const id = req.params.id
  Record.findById(id).then(record => {
    const name = record.name
    const date = tool.removeTime(record.date)
    const amount = record.amount
    Category.findById(record.categoryId).then(item => {
      const category = item.name
      res.render('edit', { name, date, amount, category, id })
     })
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

app.put('/records/:id', (req, res) => {
  // 尚未標記 user
  const id = req.params.id
  const { name, date, amount, category } = req.body
  Record.findById(id).then(record => {
    record.name = name
    record.date = date
    record.amount = amount
    return Category.findOne({ name: category }).then(item => {
      record.categoryId = item._id
      record.save()
    })
  }).then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.delete('/records/:id', (req, res) => {
  // 尚未標記 user
  const id = req.params.id
  Record.findById(id).then(record => {
    return record.remove()
  }).then(()=> res.redirect('/'))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})