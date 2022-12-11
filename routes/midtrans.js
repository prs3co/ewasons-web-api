const router = require('express').Router()
const midtransClient = require('midtrans-client')

const getCurrentTimestamp = () => {
  return '' + Math.round(new Date().getTime() / 1000)
}

// create
router.post('/', async (req, res) => {
  const snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: true,
    serverKey: process.env.MIDTRANS_KEY
  })

  const parameter = {
    transaction_details: {
      order_id: `CustOrder-82${getCurrentTimestamp()}`,
      gross_amount: req.body.amount
    },
    credit_card: {
      secure: true
    },
    customer_details: {
      username: req.body.username,
      email: req.body.email
    }
  }

  snap.createTransaction(parameter)
    .then((transaction) => {
      // const snapToken = snapResponse.data.token
      // const snapUrl = snapResponse.data.redirect_url
      // transaction token
      const transactionToken = transaction.token
      res.status(200).send({ transactionToken })
    })
})

module.exports = router
