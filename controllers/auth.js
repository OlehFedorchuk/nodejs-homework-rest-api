import User from "../models/user.js";
import { HttpError, sendEmail} from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import dotenv from "dotenv";
import  { nanoid } from "nanoid";
dotenv.config();

const {SECRET_KEY, BASE_URL} = process.env;

const posterPath = path.resolve("public", "avatars");

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });

if(user){
    throw HttpError (409, "Email already in use");
}
const hashPassword = await bcrypt.hash(password, 10);

if(req.file){
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(posterPath, filename);
    await fs.rename(oldPath, newPath);
    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);
    const avatarURL = path.join('avatars', filename);
    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});

res.status(201).json({
    user:{
        email: newUser.email,
        subscription: newUser.subscription,
    }
})
}
const verificationToken = nanoid();
const newUser = await User.create({ ...req.body, avatarUrl: gravatar.url(email, {s: 250}), password: hashPassword, verificationToken});
const mail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to virify</a>`
       
    }
    await sendEmail(mail);

res.status(201).json({
    user:{
        email: newUser.email,
        subscription: newUser.subscription,
    }
})
}

const verify = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});

    if(!user){
        throw HttpError(404, 'User not found');
    }
    await User.findByIdAndUpdate(user._id, {verificationToken: null, verify: true})

res.status(200).json({
    message: 'Verification successful',
})
}
const verifyRefresh = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw HttpError(401, "Email not found")
    }

    if (user.verify === true) {
        throw HttpError(400, 'Verification has already been passed')
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html:`<a target='_blank' href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click to verify</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
}

const login = async(req,res) => {
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Not authorizet");
    }
    if(!user.verify){
        throw HttpError(400, "First needed verify email")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Email or password is wrong");
    }
    
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
   
    res.json({
        token,
        user:{
            email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription: subscription,
    })
}
const logout = async(req,res) =>{
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json({})
}


const subscriptionUpdate = async (req, res) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");
    const { id } = jwt.verify(token, SECRET_KEY);
    const result = await User.findByIdAndUpdate(id, req.body, {new: true});
    res.json(result)
   
}
const updateAvatar = async (req, res) => {
    const { email } = req.user;

    const { path: oldPath, filename } = req.file;

    const newPath = path.join(posterPath, filename)

    await fs.rename(oldPath, newPath)

    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);

    const avatarURL = path.join('avatars', filename)

    await User.findOneAndUpdate({email}, { avatarURL }, {new: true})
    
    res.status(200).json({
        avatarURL
    })
}
export default {
    register: ctrlWrapper(register), 
    verify: ctrlWrapper(verify),
    verifyRefresh: ctrlWrapper(verifyRefresh),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
    updateAvatar: ctrlWrapper(updateAvatar),
};