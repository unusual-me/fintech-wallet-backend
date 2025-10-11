import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";
import jwt from "jsonwebtoken";
import { Schema, Document, Types } from "mongoose";
import "joi";
import { signupSchema , loginSchema, changePasswordSchema} from "../services/validationSchema"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Signup
export const signup = async (req: Request, res: Response) => {
  try {

    //Payload Validation
    let {error} = signupSchema.validate(req.body)
    
    if(error){
        res.status(400).json({ success : false, error: true, message: error.message, data : [] });
    }

    const { name, email, password, mobile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success : true, error: false, data : [], message: "User already exists" });

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

    res.status(200).json({success : true, error: false, data : {user: { id: user._id, name: user.name, email: user.email}, token }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success : false, error: true, message: "Internal Server error" , data : []});
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {

    //Payload Validation
    let {error} = loginSchema.validate(req.body)
    
    if(error){
        res.status(400).json({ success : false, error: true, message: error.message, data : [] });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success : false, error: true, data : [], message: "Invalid credentials" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success : false, error: true, data : [], message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({success : true, error: false, data : {user: { id: user._id, name: user.name, email: user.email }, token} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success : false, error: true, message: "Internal Server error" , data : []});
  }
};

// Change password 
export const changePassword = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate payload
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: true, message: error.message, data: [] });
    }

    const { email, old_password, new_password } = req.body;

    // Step 2: Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: true, message: "No user found for this email", data: [] });
    }

    // Step 3: Verify old password
    const isMatch = await user.comparePassword(old_password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Incorrect current password", data: [] });
    }

    // Step 4: Update new password
    user.password = new_password; // password will be auto-hashed by pre-save hook (if implemented)
    await user.save();

    // Step 5: Send success response
    res.status(200).json({
      success: true,
      error: false,
      message: "Password changed successfully",
      data: [],
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
      data: [],
    });
  }
};
