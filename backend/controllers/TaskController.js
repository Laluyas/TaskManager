const { default: mongoose } = require('mongoose')
const Task = require('../models/TaskModel')
const User = require("../models/UserModel");

const getTasks = async (req,res)=>{
    const tasks = await Task.find({}).populate('users','username email')
    if(!tasks){
        res.status(400).json({error:'No Task found'})
    }else{
        res.status(200).json(tasks)
    }
}

const getTask = async (req,res)=>{
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({error: 'No Task found (id not valid)'})
    }
    const task = await Task.findById(id).populate('users','username email')
    if (!task){
        res.status(400).json({error:'No Task found'})
    }
        res.status(200).json(task)
    
}

const createTask = async (req, res) => {
    const { user_ids, title, description, dueDate, priority, status, category } = req.body;
  
    try {
      // Assuming user_id is an array of user IDs
      const task = await Task.create({
        users: user_ids, // Assigning user_id directly assuming it's an array of user IDs
        title,
        description,
        dueDate,
        priority,
        status,
        category
      });
  
      // Populate the 'users' field in the task with actual user documents
      const users = await User.find({ _id: { $in: task.users } });
      task.users = users;
  
      res.status(200).json({mssg: "Task created successfully"});
    } catch (error) {
      res.status(400).json({ mssg: error.message });
    }
  };

const updateTask = async(req,res)=>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({mssg: 'Not a valid id'})
    }
    const task = await Task.findByIdAndUpdate({_id: id},{
        ...req.body
    }
    )
    if (!task){
        res.status(400).json({mssg:'No Task found'})
    }else{
        res.status(200).json({mssg:"Task updated successfully"})
    }
}

const deleteTask = async (req,res)=>{
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({error: 'No Task found (id not valid)'})
    }
    const task = await Task.findByIdAndDelete({_id: id})
    // const task = await Task.deleteMany()
    if (!task){
        res.status(400).json({error:'No Task found'})
    }else{
        res.status(200).json(task)
    }
    
}

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask    
}