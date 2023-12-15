require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const Admin = require("./models/admin.model");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server has started!");
    });
  });

const getAdmins = async () => {
  const admins = await Admin.find();
  return admins;
};

app.get("/api/admins", async (req, res) => {
  const admins = await getAdmins();
  console.log(admins);
  res.json(admins);
});
