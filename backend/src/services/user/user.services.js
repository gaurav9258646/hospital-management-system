const User = require("../../models/user");

const registerUser = async (data) => {

  const user = await User.create(data);

  return user;
};


const findUserByEmail = async (email) => {

  const user = await User.findOne({ email });

  return user;
};


const findUserById = async (id) => {

  const user = await User.findById(id).select("-password");

  return user;
};


const updateUser = async (id, data) => {

  const user = await User.findByIdAndUpdate(
    id,
    data,
    { new: true }
  ).select("-password");

  return user;
};


const deleteUser = async (id) => {

  const user = await User.findByIdAndDelete(id);

  return user;
};


module.exports = {
  registerUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser
};