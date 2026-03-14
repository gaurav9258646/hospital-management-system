const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (data) => {

  const accessToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });

  const refreshToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });

  return { accessToken, refreshToken };
};

const hashpassword = (password) => {
  return bcrypt.hash(password, 12);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  hashpassword,
  comparePassword
};