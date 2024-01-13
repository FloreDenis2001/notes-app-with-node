const jwt = require('jsonwebtoken');

const handleErrorResponse = (res, error, message, statusCode = 500) => { 
    console.error(`Error: ${message}`, error); 
    return res.status(statusCode).json({ success: false, message: `Error ${message}.` }); 
};

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader?.split(' ')[1];

    if (!token) {
        return handleErrorResponse(res, null, 'Unauthorized - No token provided', 401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return handleErrorResponse(res, err, 'Unauthorized - No valik token', 401)
        }

        req.userId = decoded.id;

        next();
    })
}

module.exports = {
    handleErrorResponse,
    verifyToken
}