export const handleSaveError = (error, data, next) => {
    const {name, code} = error;
    console.log(name);
    console.log(code);
    const status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    error.status = status;
    next();
};

export const runValidatorsUpdate = function(next) {
    this.options.runValidators = true;
    next();
}