import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  wallet?: Types.ObjectId; //singular, optional because user might not have wallet yet
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mobile: { type: String },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" }, // singular
  },
  { timestamps: true }
);

// Password hashing
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
