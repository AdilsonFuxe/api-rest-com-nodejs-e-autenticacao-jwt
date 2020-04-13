const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports= (request, response, next) =>{
    const authHeader = request.headers.authorization;

    if(!authHeader)
        return response.status(401).send({error:'No token provided.'});

    const parts = authHeader.split(' ');

    if(parts.length !== 2)
        response.status(401).send({error: 'Token error.'});

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        response.status(401).send({error: 'Token mal formado.'});

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err)
            response.status(401).send({error:'Token invalid.'});
        request.userId = decoded.id;
        return next();
    })
    
    
}