const User = require('../models/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const CryptoJS = require('crypto-js')
const router = require('express').Router()

// router.get('/usertest', (req, res) => {
//   res.send('user test is successfull');
// });

// router.post('/userposttest', (req, res)=> {
//   const username = req.body.username;
//   res.send(`your username is ${username}`);
// })

// update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted')
  } catch (error) {
    res.status(500).json(error)
  }
})

// get user
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get all user
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get user stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const stats = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' }
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ])
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
