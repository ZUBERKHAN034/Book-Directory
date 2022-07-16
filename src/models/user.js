const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        lowercase: true,
        unique: true,
    },
    displayName: {
        type: String,
        trim: true
    },
    // google
    googleId: {
        type: String,
        unique: true,
        sparse: true,
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


module.exports = mongoose.model('User', userSchema);