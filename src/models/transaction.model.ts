import mongoose, { Schema, Document } from "mongoose";

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ITransaction extends Document {
  wallet: mongoose.Types.ObjectId;      // wallet affected
  senderWallet?: mongoose.Types.ObjectId; // for TRANSFER
  receiverWallet?: mongoose.Types.ObjectId; // for TRANSFER
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  referenceId: string;                  // idempotency key
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    senderWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    receiverWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["DEPOSIT", "WITHDRAW", "TRANSFER"], required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    referenceId: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
