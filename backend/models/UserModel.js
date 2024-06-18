const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    required: true,
    enum: ['Manager', 'Employee'], // Restricting role to 'Manager' and 'Employee'
  },
  });

  UserSchema.statics.register = async function(email,password,role) {
    // Validation for email and password
  if (!email || !password || !role || role.length === 0) {
    throw new Error('Email, Password, and Role fields are required');
  }

  // Check if role contains valid values (you can customize this check based on your enumeration)
  const validRoles = ['Manager', 'Employee']; // Example valid roles
  const invalidRoles = role.filter(r => !validRoles.includes(r));
  if (invalidRoles.length > 0) {
    throw new Error(`Invalid role(s): ${invalidRoles.join(', ')}`);
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error('Email already in use');
  }

    //password hashing
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    const user = await this.create({ email, password:hash , role})

    return user
  }

  // static login method
  UserSchema.statics.login = async function(email,password){
    
    //Validation for email and password
    if (!email || !password){
      throw Error('Email and Password fields are required')
    }
    const user = await this.findOne({email})
    if (!user){
      throw Error('Invalid Email Address')
    }
    const match = await bcrypt.compare(password,user.password)

    if (!match){
      throw Error('Invalid Password')
    }

    return user
     
  }
  const User = mongoose.model('User', UserSchema);

  module.exports = User;
