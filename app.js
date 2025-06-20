const express = require("express");
const mongoose = require("mongoose");
const dotenv =require('dotenv')
dotenv.config();

const identifyRoutes = require("./routes/identify");

const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  
};
connectDB()
app.use("/", identifyRoutes);

module.exports = app;
