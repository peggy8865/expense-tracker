const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

const tool = require('../../tool')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, category } = req.body
  Category.findOne({ name: category })
    .then(item => {
      const categoryId = item._id
      Record.create({ name, date, amount, userId, categoryId })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ userId, _id }).then(record => {
    const name = record.name
    const date = tool.removeTime(record.date)
    const amount = record.amount
    Category.findById(record.categoryId).then(item => {
      const category = item.name
      res.render('edit', { name, date, amount, category, _id })
    })
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, amount, category } = req.body
  Record.findOne({ userId, _id }).then(record => {
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
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ userId, _id }).then(record => {
    return record.remove()
  }).then(() => res.redirect('/'))
})

module.exports = router