const User = require("../models/user-models");
const bcrypt = require("bcrypt");

const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash password
    const saltRound = 10;
    const hash_password = await bcrypt.hash(password, saltRound);

    // Create user
    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hash_password,
    });

    res
      .status(201)
      .json({
        userCreated,
        msg: "registration successful",
        token: await userCreated.generateToken(),
        userId: userCreated._id.toString(),
      });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await bcrypt.compare(password, userExist.password);

    if (user) {
      res.status(200).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or passord " });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { home, register, login };
