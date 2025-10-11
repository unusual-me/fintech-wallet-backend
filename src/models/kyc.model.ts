import mongoose, { Schema, Document } from "mongoose";

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IKyc extends Document {
  user: mongoose.Types.ObjectId;
  documents: {
    type: string; // e.g., 'Aadhaar', 'PAN', 'Selfie'
    url: string;
  }[];
  status: KycStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KycSchema = new Schema<IKyc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    documents: [
      {
        type: {
          type: String,
          enum: ["AADHAAR", "PAN", "SELFIE", "PASSPORT", "OTHER"],
        },
        url: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    rejectionReason: { type: String },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Kyc = mongoose.model<IKyc>("Kyc", KycSchema);
