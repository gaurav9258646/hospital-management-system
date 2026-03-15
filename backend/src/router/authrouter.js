const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateUserController,
  deleteUserController
} = require("./../controllers/user/auth.controllers");

const authMiddleware = require("./../Middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);

router.put("/update/:id", authMiddleware, updateUserController);
router.delete("/delete/:id", authMiddleware, deleteUserController);

module.exports = router;