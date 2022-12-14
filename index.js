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
const cors = require('cors')
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`)
})

module.exports = app;
