const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});


module.exports = mongoose;