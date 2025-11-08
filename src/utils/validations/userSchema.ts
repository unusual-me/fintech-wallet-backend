import * as Joi from "joi";

export const getProfileSchema = Joi.object({
    userId: Joi.string().required(),
})
