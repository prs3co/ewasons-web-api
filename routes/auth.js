const User = require('../models/User')
const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

// register
router.post('/register', body('username').isLength({ min: 1 }), body('email').isEmail(), body('password').isLength({ min: 8 }), async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString()
  })

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

// login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    // !user && res.status(401).json("Wrong credentials!")
    //
    // const hashedPassword = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SECRET
    // );

    // const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // originalPassword !== req.body.password && res.status(401).json("Wrong credentials!")

    // const { password, ...others} = user._doc;

    // res.status(200).json(others)
    if (!user && res.status(401)) {
      return res.json('Wrong credentials!')
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    )

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '3d' }
    )

    if (originalPassword !== req.body.password && res.status(401)) {
      return res.json('Wrong credentials!')
    }

    const { password, ...others } = user._doc

    res.status(200).json({ ...others, accessToken })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
