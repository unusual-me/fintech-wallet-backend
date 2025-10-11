import { Request, Response } from "express";
import mongoose from "mongoose";
import { Wallet } from "../models/wallet.model";
import { Transaction } from "../models/transaction.model";
import { successResponse, errorResponse } from "../utils/response";
import { v4 as uuidv4 } from "uuid";

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(50);
    return successResponse(res, transactions, "Transaction history fetched");
  } catch (err) {
    console.error(err);
    return errorResponse(res);
  }
};


// ----------------------------
// Deposit Funds
// ----------------------------

export const deposit = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { walletId, amount, description } = req.body;
    const wallet = await Wallet.findById(walletId).session(session);
    if (!wallet) return errorResponse(res, "Wallet not found", 404);

    wallet.balance += amount;

    const tx = await Transaction.create(
      [
        {
          wallet: wallet._id,
          amount,
          type: "DEPOSIT",
          status: "SUCCESS",
          referenceId: uuidv4(),
          description: description || "Wallet top-up",
        },
      ],
      { session }
    );

    await wallet.save({ session });
    await session.commitTransaction();

    return successResponse(res, tx[0], "Deposit successful");
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return errorResponse(res, "Failed to process deposit");
  } finally {
    session.endSession();
  }
};

// ----------------------------
// Withdraw Funds
// ----------------------------

export const withdraw = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { walletId, amount, description } = req.body;
    const wallet = await Wallet.findById(walletId).session(session);
    if (!wallet) return errorResponse(res, "Wallet not found", 404);

    if (wallet.balance < amount)
      return errorResponse(res, "Insufficient balance", 400);

    wallet.balance -= amount;

    const tx = await Transaction.create(
      [
        {
          wallet: wallet._id,
          amount,
          type: "WITHDRAW",
          status: "SUCCESS",
          referenceId: uuidv4(),
          description: description || "Wallet withdrawal",
        },
      ],
      { session }
    );

    await wallet.save({ session });
    await session.commitTransaction();

    return successResponse(res, tx[0], "Withdrawal successful");
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return errorResponse(res, "Failed to process withdrawal");
  } finally {
    session.endSession();
  }
};
