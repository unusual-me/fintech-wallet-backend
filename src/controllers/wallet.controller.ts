import { Request, Response } from "express";
import { Wallet } from "../models/wallet.model";
import { successResponse, errorResponse } from "../utils/response";
import{ getWalletBalanceSchema } from "../utils/validations/walletSchema"

export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    /*

      POST API to fetch wallet Balance using userId.

    */

    // Payload Validation
    const { error, value } = getWalletBalanceSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, error.details.map(e => e.message).join(", "), 400);
    }

    const { userId } = value;

    // fetch wallet details using findOne based on userId. 
    const wallet = await Wallet.findOne({ user: userId }).lean();

    if (!wallet) return errorResponse(res, "Wallet not found", 404);

    return successResponse(res, { balance: wallet.balance, currency: wallet.currency });
  } catch (err: any) {
    console.error("getWalletBalance error:", err);
    return errorResponse(res, err.message || "Internal server error", 500);
  }
};
