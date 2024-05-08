import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userSchema = Joi.object({
  email: Joi.string().email().required().min(5).max(100),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(["password", "1234", "abcd"]),
});

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().min(3).max(50).required(),
  stock: Joi.number().integer().min(0).max(10000),
  price: Joi.number().precision(2).prefs({ convert: false }).min(0).required(),
});

const orderSchema = Joi.object({
  customer_email: Joi.string().email().required(),
  product: Joi.string().required(),
});

export { userSchema, productSchema, orderSchema };
