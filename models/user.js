import { Schema, model } from "mongoose";
import Joi from "joi";
import {handleSaveError} from "./hooks.js";

const userSchema = new Schema({
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        avatarURL:
        {    
          type: String,
        },
        token: {
          type: String,
          default: "",
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        }
},{versionKey: false, timestamps: true});


userSchema.post("save", handleSaveError)

const registerSchema = Joi.object({
    password: Joi.string().min(6).required().description("Set password for user"),
    email: Joi.string().email().required().description("Email is required"),
})
const loginSchema = Joi.object({
    password: Joi.string().min(6).required().description("Set password for user"),
    email: Joi.string().email().required().description("Email is required"),
})
const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
})
const ownerSchema = Joi.object({
    owner: Joi.string().guid(),
})

 export const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
    ownerSchema,
}
const User = model("user", userSchema);

export default User;
