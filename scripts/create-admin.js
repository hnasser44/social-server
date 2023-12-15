require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/admin.model");
const { prompt } = require("enquirer");

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    createAdmin();
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err.message}`);
  });

async function createAdmin() {
  const admin = new Admin();
  const questions = [
    {
      type: "input",
      name: "username",
      message: "Enter username: ",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password: ",
    },
  ];
  const answers = await prompt(questions);
  admin.username = answers.username;
  admin.password = answers.password;
  try {
    await admin.save();
    console.log(`Admin ${admin.username} created successfully`);
  } catch (err) {
    if (err.message.includes("duplicate key error"))
      console.log(`Admin ${admin.username} already exists`);
    else console.log(err.message);
  } finally {
    mongoose.connection.close();
  }
}
