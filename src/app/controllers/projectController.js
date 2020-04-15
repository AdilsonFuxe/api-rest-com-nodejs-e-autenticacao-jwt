const Project = require('../models/project');
const Task = require('../models/task');

module.exports={
    async index(request, response){
        try{
            const projects = await Project.find().populate(['user', 'task']);
            return response.send({projects});
        }
        catch(err){
            return response.status(400).send({error:"Error loading projects!"});
        }
    },
    async show(request, response){
        const {projectID} = request.params;
        try{
            const project = await Project.findById(projectID).populate(['user', 'task']);
            return response.send({project});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error:"Error loadind project!"});
        }
    },
    async create(request, response){
        const {name, description, task} = request.body;
        try{
            const project = await Project.create({name, description, user:request.userId});
            
            await Promise.all(task.map(async task => {
                const projectTask = new Task({...task, project:project._id});
                await projectTask.save();

                project.task.push(projectTask);
            }));

            await project.save();

            return response.send({project});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error:"Error creating new project!"});
        }
    },
    async update(request, response){
        const {name, description, task} = request.body;
        const {projectID} = request.params;
        try{
            const project = await Project.findByIdAndUpdate(
                projectID,
                {
                    name, 
                    description, 
                    user:request.userId
                }, {new:true});
            
            project.task = [];

            await Task.remove({project: project._id});
            
            await Promise.all(task.map(async task => {
                const projectTask = new Task({...task, project:project._id});
                await projectTask.save();

                project.task.push(projectTask);
            }));

            await project.save();

            return response.send({project});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error:"Error updating project!"});
        }
    },
    async delete(request, response){
        const {projectID} = request.params;
        try{
           await Project.findByIdAndRemove(projectID);
            return response.send();
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error:"Error deleting project!"});
        }
    }
    
    
}