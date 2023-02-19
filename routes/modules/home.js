const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
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

router.get('/:category', (req, res) => {
  // 尚未標記 user
  let totalAmount = 0
  let promiseArray = []
  const categories = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  const category = req.params.category

  Category.findOne({ name: category }).then(item => {
    const categoryId = item._id
    Record.find({ categoryId }).sort({ date: -1 })
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
          res.render('index', { totalAmount, records, categories, category })
        })
      })
      .catch(err => console.log(err))
  })
})

module.exports = router