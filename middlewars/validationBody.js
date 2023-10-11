import { HttpError } from "../helpers/HttpError.js";

const validateBody = contactFavoriteSchema => {
    const func = (req, res, next) => {
        const { error } = contactFavoriteSchema.validate(req.body);
    if (error) {
        next(HttpError(400, error.message));
        
    }
    next()
    }
    return func;
}
export default validateBody;