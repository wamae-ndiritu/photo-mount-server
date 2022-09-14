const express = require("express");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { User } = require("../Models/User");
const { generateToken } = require("../utils/token");

const userRouter = express.Router();

//REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const isUserExisting = await User.findOne({ email });

    if (isUserExisting) {
      res.status(400);
      // throw new Error("User already exist");
      res.json({ message: "User already exist" });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      if (savedUser) {
        res.json({
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          token: generateToken(savedUser._id),
        });
      } else {
        throw new Error("Error saving the data!");
      }
    }
  })
);

//LOGIN

userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const hashedPassword = user.password;
      const comparePassword = await bcrypt.compare(password, hashedPassword);

      if (comparePassword) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        res.json({ message: "Incorrect password" });
      }
    } else {
      res.status(400);
      res.json({ message: "Wrong user details" });
    }
  })
);

module.exports = { userRouter };
