const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('conectado a la BBDD'))
    .catch(err => console.log(err));