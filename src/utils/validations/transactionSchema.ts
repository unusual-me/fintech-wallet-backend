import Joi from "joi";

export const depositSchema = Joi.object({
  walletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});

export const withdrawalSchema = Joi.object({
  walletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional(),
});
