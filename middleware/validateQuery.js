module.exports = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            ok: false,
            datos: null,
            mensaje: "Query inválida"
        });
    }

    next();
};