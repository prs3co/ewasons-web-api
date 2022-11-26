const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    categories: {
      type: Array
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    stock: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)
