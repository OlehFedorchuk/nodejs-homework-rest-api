import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsUpdate} from "./hooks.js";
const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user', //Примітка: 'user' - назва колекції, у якій зберігаються користувачі
    require: true,
  },
})

contactSchema.post("save", handleSaveError)

contactSchema.pre("findOneAndUpdate", runValidatorsUpdate)

contactSchema.post("findOneAndUpdate", handleSaveError)

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`
  }),
  email: Joi.string().email().required().messages({
    "any.required": `missing required email field`
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required phone field`
  }),
  favorite: Joi.boolean(),
})

export const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})
 export const schemas = {
  contactAddSchema,
  contactFavoriteSchema,
}
const Contact = model("contact", contactSchema);

export default Contact;
  