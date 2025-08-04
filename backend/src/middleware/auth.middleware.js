import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token || typeof token !== "string") {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};