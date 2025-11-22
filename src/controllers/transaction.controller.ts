import { Request, Response } from "express";
import mongoose from "mongoose";
import { Wallet } from "../models/wallet.model";
import { Transaction } from "../models/transaction.model";
import { successResponse, errorResponse } from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import { depositSchema} from "../utils/validations/transactionSchema"

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
    /*
      POST API to deposit amount in user's wallet
    */

    // Payload Validation
    const { error, value } = depositSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, error.details.map(e => e.message).join(", "), 400);
    }

    const { userId, amount, description } = value;

    // Fetch wallet
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) return errorResponse(res, "Wallet not found", 404);

    // Update balance
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

    const ele = tx[0];
    const response = {
      amount: ele.amount,
      type: ele.type,
      referenceId: ele.referenceId,
      description: ele.description,
      transactionId: ele._id,
      createdAt: ele.createdAt,
      updatedAt: ele.updatedAt,
      newBalance: wallet.balance,
    };

    await session.commitTransaction();

    return successResponse(res, response, "Deposit successful");
  } catch (err: any) {
    await session.abortTransaction();
    console.error("deposit error:", err);
    return errorResponse(res, err.message || "Failed to process deposit", 500);
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
