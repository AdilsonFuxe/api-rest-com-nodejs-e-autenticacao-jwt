const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


module.exports = mongoose;