import { Request, Response } from "express";
import { Wallet } from "../models/wallet.model";
import { successResponse, errorResponse } from "../utils/response";

export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) return errorResponse(res, "Wallet not found", 404);
    return successResponse(res, { balance: wallet.balance, currency: wallet.currency });
  } catch (err) {
    console.error(err);
    return errorResponse(res);
  }
};
