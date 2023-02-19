const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

const tool = require('../../tool')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
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

router.get('/:id/edit', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  // 尚未標記 user
  const id = req.params.id
  Record.findById(id).then(record => {
    return record.remove()
  }).then(() => res.redirect('/'))
})

module.exports = router