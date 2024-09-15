const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const midtransRoute = require('./routes/midtrans')
const midtransRouteSB = require('./routes/midtranssb')
const pingRoute = require('./routes/ping')
const cron = require('node-cron')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const { default: axios } = require('axios')
// const stripeRoute = require('./routes/stripe')
dotenv.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Succesfull'))
  .catch((err) => {
    console.log(err)
  })

// app.get('/api/test', () => {
//   console.log("test is succesfull");
// })

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)
// app.use('/api/teskuy', midtransTesRoute)
// app.use('/api/checkout', stripeRoute)
app.use('/api/checkout', midtransRoute)
app.use('/api/checkoutsb', midtransRouteSB)
app.use('/api/ping', pingRoute)

const healthCheck = async () => {
  const pingUrl = 'http://localhost:5000/api/ping/heartbeat'
  try {
    await axios.get(pingUrl)
    console.error('Health check success')
  } catch (error) {
    console.error(`Health check fail: ${error}`)
  }
}

// File to store the timestamp of the last run
const timestampFilePath = path.join(__dirname, 'lastRunTimestamp.json')

// Function to get the current timestamp
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000)

// Function to read the last run timestamp
const getLastRunTimestamp = () => {
  try {
    const data = fs.readFileSync(timestampFilePath, 'utf8')
    return JSON.parse(data).timestamp
  } catch (error) {
    return 0 // Return 0 if the file doesn't exist or is unreadable
  }
}

// Function to write the current timestamp
const setLastRunTimestamp = () => {
  const timestamp = getCurrentTimestamp()
  fs.writeFileSync(timestampFilePath, JSON.stringify({ timestamp }), 'utf8')
}

cron.schedule('0 0 * * *', () => {
  const lastRun = getLastRunTimestamp()
  const now = getCurrentTimestamp()
  const fiveDaysInSeconds = 5 * 24 * 60 * 60

  if (now - lastRun >= fiveDaysInSeconds) {
    console.log(`Running the task every 5 days: ${now}`)
    // Perform the task

    // Update the timestamp after running the task
    setLastRunTimestamp()
  } else {
    console.log('Not yet time to run the task')
  }
})

healthCheck()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`)
})

module.exports = app
