import * as Joi from "joi";

export const getWalletBalanceSchema = Joi.object({
    userId: Joi.string().required(),
})