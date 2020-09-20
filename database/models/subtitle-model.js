const mongoose = require('mongoose')


const SubtitleSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    },
    crawled: {
        type: Boolean,
        required: true,
        default: false,
        index: true,
    },
    name: String,
    grade: {
        type: Number,
        integer: true,
    },
    likeRatio: Number,
    sender: String,
    sendDate: Date,
    language: String,
    downloadCount : Number,
    downloadUrl: {
        type: String,
        trim: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
})

const Subtitle = mongoose.model('Subtitle', SubtitleSchema)


module.exports = Subtitle