const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TaskSchema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }],
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      dueDate: {
        type: Date,
      },
      priority: {
        type: Number,
        default: 3,
      },
      status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Completed'], // Restricting role to 'Manager' and 'Employee'
      },
      category: {
        type: String,
      },
}, {timestamps:true})

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;