const axios = require('axios')

// const midtransClient = require('midtrans-client')

const getCurrentTimestamp = () => {
  return '' + Math.round(new Date().getTime() / 1000)
}

const handleMainRequest = (req, res) => {
  // Perform Snap API request
  axios({
    // Below is the API URL endpoint
    url: 'https://app.midtrans.com/snap/v1/transactions',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization:
      `Basic ${Buffer.from(process.env.MIDTRANS_KEY).toString('base64')}`
      // 'Basic ' +
      // Buffer.from('SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA').toString('base64')
      // Above is API server key for the Midtrans account, encoded to base64
    },
    data:
      // Below is the HTTP request body in JSON
      {
        transaction_details: {
          order_id: `CustOrder-102${getCurrentTimestamp()}`,
          gross_amount: 13000
        },
        credit_card: {
          secure: true
        },
        item_details: [
          {
            id: 'a01',
            price: 7000,
            quantity: 1,
            name: 'Kabel Bekas'
          },
          {
            id: 'b02',
            price: 3000,
            quantity: 2,
            name: 'Lampu Bekas'
          }
        ],
        customer_details: {
          first_name: 'Budi',
          last_name: 'Susanto',
          email: 'budisusanto@example.com',
          phone: '+628123456789',
          billing_address: {
            first_name: 'Budi',
            last_name: 'Susanto',
            email: 'budisusanto@example.com',
            phone: '08123456789',
            address: 'Sudirman No.12',
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN'
          },
          shipping_address: {
            first_name: 'Budi',
            last_name: 'Susanto',
            email: 'budisusanto@example.com',
            phone: '0812345678910',
            address: 'Sudirman',
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN'
          }
        }
      }
  }).then(
    (snapResponse) => {
      const snapToken = snapResponse.data.token
      const snapUrl = snapResponse.data.redirect_url
      // console.log('Retrieved snap token:', snapToken)
      // Pass the Snap Token to frontend, render the HTML page
      res.status(200).json({ snapToken, snapUrl })
    },
    (error) => {
      res.status(500).json(error)
      console.log(error)
    }
  )
}
const handleTestRequest = (req, res) => {
  // Perform Snap API request
  axios({
    // Below is the API URL endpoint
    url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization:
      // `Basic ${Buffer.from(process.env.MIDTRANS_KEY).toString('base64')}`
      'Basic ' +
      Buffer.from('SB-Mid-server-GwUP_WGbJPXsDzsNEBRs8IYA').toString('base64')
      // Above is API server key for the Midtrans account, encoded to base64
    },
    data:
      // Below is the HTTP request body in JSON
      {
        transaction_details: {
          order_id: `CustOrder-102${getCurrentTimestamp()}`,
          gross_amount: 13000
        },
        credit_card: {
          secure: true
        },
        item_details: [
          {
            id: 'a01',
            price: 7000,
            quantity: 1,
            name: 'Kabel Bekas'
          },
          {
            id: 'b02',
            price: 3000,
            quantity: 2,
            name: 'Lampu Bekas'
          }
        ],
        customer_details: {
          first_name: 'Budi',
          last_name: 'Susanto',
          email: 'budisusanto@example.com',
          phone: '+628123456789',
          billing_address: {
            first_name: 'Budi',
            last_name: 'Susanto',
            email: 'budisusanto@example.com',
            phone: '08123456789',
            address: 'Sudirman No.12',
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN'
          },
          shipping_address: {
            first_name: 'Budi',
            last_name: 'Susanto',
            email: 'budisusanto@example.com',
            phone: '0812345678910',
            address: 'Sudirman',
            city: 'Jakarta',
            postal_code: '12190',
            country_code: 'IDN'
          }
        }
      }
  }).then(
    (snapResponse) => {
      const snapToken = snapResponse.data.token
      const snapUrl = snapResponse.data.redirect_url
      // console.log('Retrieved snap token:', snapToken)
      // Pass the Snap Token to frontend, render the HTML page
      res.status(200).json({ snapToken, snapUrl })
    },
    (error) => {
      res.status(500).json(error)
      console.log(error)
    }
  )
}

module.exports = {
  handleMainRequest,
  handleTestRequest
}
