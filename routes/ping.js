const mongoose = require('mongoose')
const router = require('express').Router()

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${day}-${month}-${year}`
}

router.get('/heartbeat', async (req, res) => {
  const now = new Date()
  const currentTime = formatDate(now)
  try {
    await mongoose.connection.db.command({ ping: 1 })
    res.send(`DB Server is running ${currentTime}`)
  } catch (error) {
    res.send(`DB Server is down: ${error}`)
  }
})

module.exports = router
