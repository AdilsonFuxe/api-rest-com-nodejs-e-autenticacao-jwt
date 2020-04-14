
const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const mailer = require('../../modules/mailer');


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
    },

    async forgot_password(request, response){
        const {email} = request.body;

        try {
            
            const user = await User.findOne({email});

            if(!user)
                return response.status(400).send({error: 'User not found.'});

            const token = crypto.randomBytes(20).toString('HEX');

            const now = new Date();
            now.setHours(now.getHours()+1);

            await User.findByIdAndUpdate(user.id, {
                '$set':{
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            });

            

            mailer.sendMail({
                to:email,
                from: 'adilsonfuxe.fuxe@gmail.com',
                subject: "Forgot password ✔",
                text: `Você esqueceu a sua senha? não tem problema, utilize o token para alterar ${token}` ,// html body, // plain text body
                html:`<p><strong>Você esqueceu a sua senha?</strong> não tem problema, utilize o token para alterar ${token}</p>` // html body
            }, (err)=>{
                if(err){console.log(err)
                    return response.status(400).send({error:'can not send forgot password email'});}
                return response.send();
            });
            
        } catch (err) {
            console.log(err);
            return response.status(400).send({error:'Error on forgot passeord, please try again', err});
        }
    },

    async reset_password(request, response){
        const {email, token, password} = request.body;

        try {
            const user = await User.findOne({email}).select('+passwordResetToken passwordResetExpires');

            if(!user)
                return response.status(400).send({error: 'User not found.'});
            if(token !== user.passwordResetToken)
                return response.status(400).send({error: 'Token Invalid.'});
           
            const now = new Date();
            
            if(now > user.passwordResetExpires)
                return response.status(400).send({error: 'Token Expired, please generate a new one'});
          
            user.password = password;
            user.save();

            return response.send();

        } catch (err) {
            return response.status(400).send({error: 'can not reset password please try again'});
        }
    }
}