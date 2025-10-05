import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";
import jwt from "jsonwebtoken";
import { Schema, Document, Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = new User({ name, email, password, mobile });
    await user.save();

    // Create wallet automatically
    const wallet = new Wallet({ user: user._id });
    await wallet.save();

    // Link wallet to user
    user.wallet = wallet._id as Types.ObjectId;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
