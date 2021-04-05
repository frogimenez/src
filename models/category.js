const { model, Schema } = require('mongoose')

const categorySchema = new Schema({
    nameCategory: {
        type: String,
        required: true
    },
    descriptionCategory: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
})

module.exports = model('Category', categorySchema)