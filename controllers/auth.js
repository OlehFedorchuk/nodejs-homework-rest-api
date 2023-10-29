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

const {SECRET_KEY} = process.env;

const posterPath = path.resolve("public", "avatars");

const register = async(req, res) => {
    const {email, password} = req.body;
    // console.log('password', password);
    const user = await User.findOne({ email });

if(user){
    throw HttpError (409, "Email already in use");
}
const hashPassword = await bcrypt.hash(password, 10);
// const verificationCode = nanoid();
// console.log('verificationCode', verificationCode);


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
const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Click to virify email</a>`
    }
    await sendEmail(verifyEmail);
res.status(201).json({
    user:{
        email: newUser.email,
        subscription: newUser.subscription,
    }
})
}



const login = async(req,res) => {
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Not authorizet");
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
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
    updateAvatar: ctrlWrapper(updateAvatar),
};