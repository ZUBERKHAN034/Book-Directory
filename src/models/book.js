const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    bookId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default:"Image Not Available"
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    chapters: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discounted: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


module.exports = mongoose.model('Book', bookSchema);