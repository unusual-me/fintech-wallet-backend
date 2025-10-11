import mongoose, { Schema, Document } from "mongoose";

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER" | "MERCHANT_PAYMENT";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ITransaction extends Document {
  wallet: mongoose.Types.ObjectId;      // wallet affected
  senderWallet?: mongoose.Types.ObjectId; // for TRANSFER
  receiverWallet?: mongoose.Types.ObjectId; // for TRANSFER
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  merchantId?: string;
  externalRefId?: string;
  category?: string;
  meta?: Record<string, any>;
  referenceId: string;                  // idempotency key
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    senderWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    receiverWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "TRANSFER", "MERCHANT_PAYMENT"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    merchantId: { type: String },
    externalRefId: { type: String },
    category: { type: String },
    meta: { type: Object },
    referenceId: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
