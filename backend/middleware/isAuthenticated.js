
import jwt from "jsonwebtoken"
import "dotenv/config"
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        // Token hai? ✅
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid or missing"
            })
        }
        const token = authHeader.split(' ')[1]
        let tokenData;
        try {
            // Token asli hai? ✅
            tokenData = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            // Expire nahi? ✅
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "Token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token is missing & verification failed"
            })
        }

        
        // User database mein hai? ✅
        const user = await User.findById(tokenData.id)
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        req.id = user._id
        // for admin
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdmin = (req, res, next) =>{
    if(req.user && req.user.role === "admin"){
        next()
    } else{
        return res.status(403).json({
            message:"Access denied: admin only"
        })
    }
}