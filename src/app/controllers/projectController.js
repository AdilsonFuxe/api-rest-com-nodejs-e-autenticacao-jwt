module.exports={
    async index(request, response){
        return response.send({user: request.userId});
    }
}