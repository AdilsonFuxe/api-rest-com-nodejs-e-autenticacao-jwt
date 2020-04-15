const mongoose = require('../../database/index');

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    task:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    created_at:{
        type: Date,
        default: new Date()
    },
    update_at:{
        type: Date,
        default: new Date()
    }
})



const Project = mongoose.model('Project', projectSchema);
module.exports = Project;