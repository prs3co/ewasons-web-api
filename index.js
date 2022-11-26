const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')

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

app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`)
})
