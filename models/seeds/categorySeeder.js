const db = require('../../config/mongoose')
const Category = require('../category')

const SEED_CATEGORY = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

db.once('open', () => {
  Promise.all(Array.from(SEED_CATEGORY, name => {
    return Category.create({ name })
  })).then(() => {
    console.log('categorySeeder done')
    process.exit()
  })
})