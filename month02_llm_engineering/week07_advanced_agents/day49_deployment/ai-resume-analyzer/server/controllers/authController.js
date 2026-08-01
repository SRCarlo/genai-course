import bcrypt from "bcrypt";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      name,

      email,

      password,
    } = req.body;

    const exists = await User.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,

      10,
    );

    const user = await User.create({
      name,

      email,

      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,

      name: user.name,

      email: user.email,

      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const {
      email,

      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,

        user.password,
      ))
    ) {
      return res.json({
        _id: user._id,

        name: user.name,

        email: user.email,

        token: generateToken(user._id),
      });
    }

    res.status(401).json({
      message: "Invalid Credentials",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
