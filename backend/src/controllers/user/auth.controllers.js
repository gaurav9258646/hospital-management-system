const {
  registerUser,
  findUserByEmail,
  updateUser,
  deleteUser
} = require("../../services/user/user.services");

const {
  generateToken,
  hashPassword,
  verifyPassword
} = require("../../utils");



// Register
const register = async (req, res) => {

  const { name, email, password, phone, address } = req.body;

  console.log(req.body);

  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({
      success: false,
      error: "All fields required"
    });
  }

  try {

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists"
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await registerUser({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "patient"
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Registration failed"
    });

  }
};



// Login
const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password required"
    });
  }

  try {

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid password"
      });
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id,
      role: user.role
    });

    user.password = undefined;

    return res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Login failed"
    });

  }
};



// Update User
const updateUserController = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await updateUser(id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: user
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Update failed"
    });

  }
};



// Delete User
const deleteUserController = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Delete failed"
    });

  }
};

module.exports = {
  register,
  login,
  updateUserController,
  deleteUserController
};