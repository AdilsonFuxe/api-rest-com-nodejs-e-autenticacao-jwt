
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400
    });
}

module.exports={
    async create(request, response){
        const {email} = request.body;
        try{

            if(await User.findOne({ email}))
                return response.status(400).send({error: 'User already exist.'});

            const user = await User.create(request.body);
            user.password = undefined;

            return response.send({user, token:generateToken({id:user.id})});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error: 'Registration failed'});
        }
    },
    async authenticate(request, response){
        const {email, password} = request.body;
        try{
            const user = await User.findOne({email}).select('+password');

            if(!user)
                return response.status(400).send({error: 'User not found.'});
            
            if(! (crypto.createHash('sha256').update(password).digest('hex') === user.password))
                return response.status(400).send({error:'invalid password'});
        
            user.password = undefined;
            
           
            
            response.send({user, token:generateToken({id:user.id})});


        }
        catch(err){
            console.log(err);
        }
    }
}