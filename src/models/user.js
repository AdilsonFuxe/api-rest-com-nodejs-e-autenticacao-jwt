const mongoose = require('../database/index');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    created_at:{
        type: Date,
        default: new Date()
    },
    update_at:{
        type: Date,
        default: new Date()
    }
})

userSchema.pre('save',async function (next){
    const hash = crypto.createHash('sha256').update(this.password).digest('hex')
    this.password = hash;
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;