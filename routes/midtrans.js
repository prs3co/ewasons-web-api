// const router = require('express')
const midtransClient = require('midtrans-client')

const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_KEY
})

const parameter = {
  transaction_details: {
    order_id: 'YOUR-ORDERID-123456',
    gross_amount: 10000
  },
  credit_card: {
    secure: true
  },
  customer_details: {
    first_name: 'budi',
    last_name: 'pratama',
    email: 'budi.pra@example.com',
    phone: '08111222333'
  }
}

const snapRoute = snap.createTransaction(parameter)
  .then((transaction) => {
    // transaction token
    const transactionToken = transaction.token
    return ('transactionToken:', transactionToken)
  })

// router.post('/payment', (req, res) => {
//   stripe.charges.create({
//     source: req.body.tokenId,
//     amount: req.body.amount,
//     currency: 'sgd'
//   }, (stripeErr, stripeRes) => {
//     if (stripeErr) {
//       res.status(500).json(stripeErr)
//     } else {
//       res.status(200).json(stripeRes)
//     }
//   })
// })

module.exports = snapRoute
