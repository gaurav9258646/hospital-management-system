const { registerUser, findUserByEmail } = require("../services/user.services");
const { generateToken, comparePassword, hashpassword } = require("../utils");


const register = async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      error: "All fields are required",
    });
  }

  try {

    const hashPswd = await hashpassword(password);

    const user = await registerUser({
      name,
      email,
      password: hashPswd,
      role: "user" 
    });

    user.password = undefined;

    return res.json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (error) {

    console.log(error);

    if (error.code === 11000) {
      return res.json({
        success: false,
        error: "User already exists"
      });
    }

    return res.json({
      success: false,
      error: "User registration failed"
    });
  }
};



const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        error: "User not found"
      });
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.json({
        success: false,
        error: "Wrong password"
      });
    }


    const { accessToken, refreshToken } = generateToken({
      id: user._id,
      role: user.role   
    });


    user.password = undefined;


    return res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      error: "Something went wrong"
    });
  }
};

module.exports = { register, login };