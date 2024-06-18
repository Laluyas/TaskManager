const User = require("../models/UserModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing
const validator = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, "zR8#fWk2@MnP!dS5", { expiresIn: "1h" });
};

//Login user
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).json({ mssg: 'Email and password are required' });
  }

  try {
    const user = await User.login(email, password, role);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ mssg: 'User logged in successfully' });
  } catch (error) {
    res.status(400).json({ mssg: error.message });
  }
};


//Register user
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Check if email, password, or role is missing
  if (!email || !password || !role) {
    return res.status(400).json({ mssg: 'Email, password, and role are required' });
  }

  try {
    const user = await User.register(email, password, role);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ mssg:"User registered successfully" });
  } catch (error) {
    res.status(400).json({ mssg: error.message });
  }
};


//Create new user
const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all users
const getUsers = async (req, res) => {
  const users = await User.find({});
  if (!users) {
    res.status(400).json({ mssg: "no users found" });
  }
  res.status(200).json(users);
};

//Get single user
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No User found (id not valid)" });
  }
  const user = await User.findById(id);
  if (!user) {
    res.status(400).json({ error: "No User found" });
  }
  res.status(200).json(user);
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ mssg: "Not a valid id" });
  }

  // Extract password separately to encrypt if it exists in req.body
  const { password, ...updateData } = req.body;

  // Fetch current user data from the database
  let currentUser;
  try {
    currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ mssg: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ mssg: "Failed to fetch user" });
  }

  // Validate updateData fields against schema
  const validFields = Object.keys(currentUser.schema.paths); // Get all valid paths from the schema

  for (let field in updateData) {
    if (!validFields.includes(field)) {
      return res.status(400).json({ mssg: `Invalid field '${field}'` });
    }
  }

  // Check if there are any fields other than password in updateData and ensure they are different
let fieldsToUpdate = Object.keys(updateData);
let fieldsToUpdateCount = 0;

fieldsToUpdate.forEach((field) => {
  // Check if the field exists in currentUser and updateData
  if (currentUser[field] !== undefined && updateData[field] !== undefined) {
    // Special handling for enum fields like 'role'
    if (field === 'role') {
      // Compare enum values directly
      if (currentUser[field].toString() !== updateData[field].toString()) {
        fieldsToUpdateCount++;
      }
    } else {
      // For other fields, compare values
      if (currentUser[field] !== updateData[field]) {
        fieldsToUpdateCount++;
      }
    }
  }
});

if (fieldsToUpdateCount === 0 && !password) {
  return res.status(400).json({ mssg: 'No fields to update or fields are identical to current values' });
}

  if (fieldsToUpdateCount === 0 && !password) {
    return res
      .status(400)
      .json({
        mssg: "No fields to update or fields are identical to current values",
      });
  }

  if (password) {
    try {
      // Hash the password with bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      updateData.password = hashedPassword;
    } catch (error) {
      return res.status(500).json({ mssg: "Failed to hash password" });
    }
  } else {
    currentUser = await User.findById(id);
    updateData.password = currentUser.password;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(400).json({ mssg: "No User found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ mssg: error.message });
  }
};

//Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ mssg: "No User found (id not valid)" });
  }
  const user = await User.findByIdAndDelete({ _id: id });
  if (!user) {
    res.status(400).json({ mssg: "No User found" });
  } else {
    res.status(200).json({ mssg: "User Deleted Successfully" });
  }
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  loginUser,
  registerUser,
};
