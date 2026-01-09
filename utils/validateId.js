// Middleware simple para validar que :id es un número entero válido
module.exports = function validateIdParam(paramName = 'id') {
    return (req, res, next) => {
        const val = req.params[paramName];
        const num = Number(val);
        if (!Number.isFinite(num) || String(num) !== String(val)) {
            return res.status(400).json({ ok: false, datos: null, mensaje: 'Identificador inválido' });
        }
        next();
    };
};
