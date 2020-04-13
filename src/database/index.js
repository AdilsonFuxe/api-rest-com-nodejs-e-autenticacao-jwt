const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


module.exports = mongoose;