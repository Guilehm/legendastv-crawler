const mongoose = require('mongoose')


const TitleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    crawled: {
        type: Boolean,
        required: true,
        default: false,
        index: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
})

const Title = mongoose.model('Title', TitleSchema)


module.exports = Title
