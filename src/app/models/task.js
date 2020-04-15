const mongoose = require('../../database/index');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    completed:{
        type:Boolean,
        required: true,
        default: false
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



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;