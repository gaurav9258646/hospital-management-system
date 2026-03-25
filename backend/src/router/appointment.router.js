const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} = require("./../controllers/user/appointmentController");

const authorize = require("./../Middleware/roleMiddleware");
const authenticate = require("./../Middleware/authMiddleware");

router.post("/", authenticate, authorize("patient"), createAppointment);

router.get("/", authenticate, authorize("admin"), getAllAppointments);

router.put("/:id", authenticate, authorize("doctor", "admin"), updateAppointment);

module.exports = router;