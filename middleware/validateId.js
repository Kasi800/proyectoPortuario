const idValidator = require("../validators/idValidator");

// Middleware simple para validar que :id es un número entero válido
function validateId(paramName = 'id') {
    return (req, res, next) => {
        try {
            idValidator(req.params[paramName]);
            next();
        } catch (err) {
            next(err);
        }
    };
};
module.exports = validateId;
