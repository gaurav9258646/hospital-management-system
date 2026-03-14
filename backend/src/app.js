const express = require("express");
const authRoutes = require("./router/authrouter");


const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

module.exports = app;