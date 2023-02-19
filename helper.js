const Handlebars = require('handlebars')

Handlebars.registerHelper('icon', (categoryName) => {
  const CATEGORY = {
    '家居物業': `<i class="fa-solid fa-house"></i>`,
    '交通出行': `<i class="fa-solid fa-van-shuttle"></i>`,
    '休閒娛樂': `<i class="fa-solid fa-face-grin-beam"></i>`,
    '餐飲食品': `<i class="fa-solid fa-utensils"></i>`,
    '其他': `<i class="fa-solid fa-pen"></i>`
  }
  return CATEGORY[categoryName]
})

Handlebars.registerHelper('options', (defaultCategory) => {
  const categories = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  let optionHTML = ''
  for (let i = 0; i < categories.length; i++) {
    if (categories[i] === defaultCategory) {
      optionHTML += `<option value="${categories[i]}" selected>${categories[i]}</option>`
    } else {
      optionHTML += `<option value="${categories[i]}">${categories[i]}</option>`
    }
  }
  return optionHTML
})