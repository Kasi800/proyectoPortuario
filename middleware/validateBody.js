const ApiError = require("../utils/ApiError");


module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        return next(new ApiError("Invalid request data", 400));
    }
    req.body = value;
    next();
};