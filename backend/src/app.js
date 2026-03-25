const express = require("express");
const authRoutes = require("./router/authrouter");
const appointmentRoutes =  require("./router/appointment.router")
const doctorRoutes = require("./router/doctor.router")


const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/doctor", doctorRoutes)
app.use("/appointment",appointmentRoutes)

module.exports = app;