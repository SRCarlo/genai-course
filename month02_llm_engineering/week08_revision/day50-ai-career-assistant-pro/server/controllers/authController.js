import User from "../models/User.js";

import { hashPassword, comparePassword } from "../utils/hashPassword.js";

import generateToken from "../utils/generateToken.js";

// Signup

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,

      email,

      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,

      message: "Account created successfully",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
