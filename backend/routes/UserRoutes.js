const express = require("express")

const User = require('../models/UserModel')
const { createUser, getUser, getUsers, updateUser, deleteUser, loginUser, registerUser } = require('../controllers/UserController')

const router = express.Router()

//Login user
router.post('/login', loginUser)

//Register user
router.post('/register', registerUser)


//GET all user
router.get('/', getUsers)

//GET single user
router.get('/:id', getUser)

//POST a new user
router.post('/', createUser)

//DELETE a new user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)


module.exports = router