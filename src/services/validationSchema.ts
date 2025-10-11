import * as Joi from "joi";

export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.pattern.base': 'Password must be alphanumeric and 3-30 characters.'
}),
    mobile : Joi.string().length(10).pattern(/^[0-9]+$/).required() 
})


export const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).messages({"string.pattern.base": "Invalid Credentials"}),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({"string.pattern.base": "Invalid Credentials"}),
})