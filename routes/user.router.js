const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {requireSign} = require("../middlewares/auth.middlewares");

userRouter.post("/get-user-data", requireSign, async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);
      user.password = undefined;
      return res.status(200).send({
        message: "User data fetched successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  })

module.exports = userRouter