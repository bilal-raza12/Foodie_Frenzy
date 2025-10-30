import jwt from "jsonwebtoken";

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authrization && req.headers.authrization.split(' ')[1])
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {_id: decoded.id , email: decoded.email};
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
}

export default authMiddleware;