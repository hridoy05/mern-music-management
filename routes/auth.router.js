const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

authRouter.post('/register', async (req, res)=> {
    try {
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                message:"value must be fullfilled",
                success: false
            })
        }

        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res
        .status(200)
        .send({ message: "User already exists", success: false });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt)
        req.body.password = hashedPassword
        const user = new User(req.body)
        await user.save()
        return res
        .status(200)
        .send({ message: "User registered successfully", success: true });

                
    } catch (error) {
        return res.status(500).send({message: error.messge, success: false})
    }
})

authRouter.post("/login", async (req, res) => {
  console.log("hit login");
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      }
      const passwordsMatched = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordsMatched) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        return res.status(200).send({
          message: "User logged in successfully",
          success: true,
          data: token,
        });
      } else {
        return res
          .status(200)
          .send({ message: "Password is incorrect", success: false });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  });
  
  module.exports = authRouter