const ApiError = require("../utils/ApiError");

function validatorId(id) {
    const num = parseInt(id);

    if (num <= 0 || !Number.isFinite(num) || String(num) !== String(id)) {
        throw new ApiError('Invalid identifier', 400);
    }
}

module.exports = validatorId;