module.exports = {
  removeTime: (dateTime) => {
    const year = dateTime.getFullYear().toString().padStart(4, '0')
    const monthInNumber = dateTime.getMonth() + 1
    const month = monthInNumber.toString().padStart(2, '0')
    const date = dateTime.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${date}`
  }
}