import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  status: "active" | "inactive";
  isDefault: boolean;
  walletType: "personal" | "merchant";
  linkedSources: {
    sourceType: "BANK" | "CARD";
    sourceId: string;
    bankName?: string;
    cardLast4?: string;
    tokenRef?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDefault: { type: Boolean, default: false },
    walletType: { type: String, enum: ["personal", "merchant"], default: "personal" },
    linkedSources: [
      {
        sourceType: { type: String, enum: ["BANK", "CARD"], required: true },
        sourceId: { type: String, required: true },
        bankName: String,
        cardLast4: String,
        tokenRef: String,
      },
    ],
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
