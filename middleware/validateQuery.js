const ApiError = require("../utils/ApiError");

module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return next(new ApiError("Invalid query parameters", 400));
    }

    req.query = value;
    next();
};