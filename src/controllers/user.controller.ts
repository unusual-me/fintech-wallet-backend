import { Request, Response } from "express";
import { User } from "../models/user.model";
import { successResponse, errorResponse } from "../utils/response";
import { getProfileSchema} from "../utils/validations/userSchema"

export const getProfile = async (req: Request, res: Response) => {
  try {

    /*
      API to fetch profile based on userId ( Internal api - need to pass userID which will only be available from SignUp / Login api post successful login. )
    */

    // Payload Validation
    const { error, value } = getProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, error.details.map(e => e.message).join(", "), 400);
    }

    const { userId } = value;

    const user = (await User.findById(userId).populate("wallet").lean()) as any;
    if (!user) return errorResponse(res, "User not found", 404);

    const finOtpt = {
      userId: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      wallet: user.wallet
        ? {
            isDefault: user.wallet.isDefault,
            walletType: user.wallet.walletType,
            balance: user.wallet.balance,
            currency: user.wallet.currency,
            status: user.wallet.status,
            linkedSources: user.wallet.linkedSources,
          }
        : null,
    };

    return successResponse(res, finOtpt, "Profile fetched successfully");
  } catch (err: any) {
    console.error("getProfile error:", err);
    return errorResponse(res, err.message || "Internal server error", 500);
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
