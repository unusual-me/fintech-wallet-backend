import { Request, Response } from "express";
import { User } from "../models/user.model";
import { successResponse, errorResponse } from "../utils/response";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate("wallet");
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, user, "Profile fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res);
  }
};

export const getKycStatus = async (req: Request, res: Response) => {
  try {
    // Placeholder — will integrate with KYC model later
    return successResponse(res, { status: "PENDING" }, "KYC status fetched");
  } catch (err) {
    console.log(err);
    return errorResponse(res);
  }
};
