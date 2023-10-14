import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/HttpError.js";

export const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
        return next(HttpError(400, ` id ${contactId} incorrect.`))
    };
    next();
};