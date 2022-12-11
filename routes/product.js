const Product = require('../models/Product')
const {
  verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken
} = require('./verifyToken')
const router = require('express').Router()

// create
router.post('/', verifyToken, async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

// update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

// delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted')
  } catch (error) {
    res.status(500).json(error)
  }
})

// get product
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get all product
router.get('/', async (req, res) => {
  const queryRecomendation = req.query.recomendation
  const queryCategories = req.query.categories
  try {
    let products

    if (queryRecomendation) {
      products = await Product.find().limit(8)
    } else if (queryCategories) {
      products = await Product.find({
        categories: {
          $in: [queryCategories]
        }
      })
    } else {
      products = await Product.find()
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get user products (put userid)
router.get('/shop/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: {
        $in: [req.params.id]
      }
    })

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
