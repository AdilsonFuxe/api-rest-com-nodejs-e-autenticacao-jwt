
const User = require('../models/user');

module.exports={
    async create(request, response){
        const {email} = request.body;
        try{

            if(await User.findOne({ email}))
                return response.status(400).send({error: 'User already exist.'});

            const user = await User.create(request.body);
            user.password = undefined;

            return response.send(user);
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error: 'Registration failed'});
        }
    }
}