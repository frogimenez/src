const { model, Schema, Mongoose } = require('mongoose')

const newTaskSchema = new Schema({
    thingToDo: {
        type: String,

    },
    date: {
        type: Date,

    },
    descriptionToDo: {
        type: String,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    createdAt: {
        type: Date,
        default: new Date
    }
})

module.exports = model('Task', newTaskSchema)