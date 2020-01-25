const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('token');

    // Check if there is token
    if(!token) return res.status(401).json({msg: "Token was not provided"});

    try {
         // Verify token
        const decoded = jwt.verify(token, 'jwtSecret');

        // Add user from payload
        req.user = decoded;
        next();   
    } catch (error) {
        res.status(400).json({msg: "Token is not valid."});
    }
}

module.exports = auth;