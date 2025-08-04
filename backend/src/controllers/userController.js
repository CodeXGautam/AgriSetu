import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config';
import cloudinary from "cloudinary";
import fs from "fs";
import jwt from "jsonwebtoken";


const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
  );

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        console.error("Error generating tokens:", error.message);
        throw new Error("Token generation failed");
    };

};

const registerUser = async (req, res) => {
    //registering user

    try {
        const { firstname, lastname, username, email, password } = req.body;

        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        if (password.lenghth < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        };

        //checking for existing user 
        const existingUser = await User.findOne({
            $or: [{ email }, { username}]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        };

        //creating new user 

        const newUser = await User.create({
            firstname,
            lastname,
            username: username,
            email: email,
            password
        });

        if (!newUser) {
            return res.status(500).json({ message: "User registration failed" });
        };

        const { accessToken, refreshToken } = await generateAccessRefreshToken(newUser._id);
        const user = await User.findById(newUser._id).select("-password -refreshToken");

        console.log('AccessToken',accessToken,'refreshToken',refreshToken);

        const options = {
            httpOnly: true,
            secure: true, // Set to true for HTTPS
            sameSite: 'none', // Required for cross-origin requests
        };

        res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ user, message: "User registered successfully" });

    } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const user = await User.findOne({email : email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
        console.log(accessToken, refreshToken)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true, // Set to true for HTTPS
            sameSite: 'none', // Required for cross-origin requests
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                user: loggedInUser,
                message: "Login successful"
            });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    };
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user,
        });

    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true, // Set to true for HTTPS
            sameSite: 'none', // Required for cross-origin requests
        };

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Error logging out user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ message: "Token expired or already used" });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true, // Set to true for HTTPS
            sameSite: 'none', // Required for cross-origin requests
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                message: "Access token refreshed",
                accessToken,
                refreshToken: newRefreshToken
            });
    } catch (error) {
        console.error("Refresh token error:", error.message);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

const googleAuthCode = async (req, res) => {
    const { code } = req.body;
    try {
        const { tokens } = await client.getToken(code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                firstname: payload.given_name || "",
                lastname: payload.family_name || "",
                username: payload.email,
                email: payload.email,
                password: process.env.DEFAULT_GOOGLE_USER_PASSWORD || "google-oauth",
                avatar: payload.picture || null
            });
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
        const options = { 
            httpOnly: true, 
            secure: true, // Set to true for HTTPS
            sameSite: 'none', // Required for cross-origin requests
        };
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ user, message: "Google login successful" });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid Google code" });
    }
};

const getInterviewInfo = async (req, res) =>{
    try {
        const info = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "interviews",
                    localField: "_id",
                    foreignField: "candidate",
                    as: "interviews"
                }
            },
            {
                $project: {
                    interviews:1,
                    _id: 0
                }
            }           
        ]);

        res.status(200)
        .json({interviews: info[0]?.interviews || []})
        
    } catch (error) {
        console.log("Error",error);
        res.status(500)
        .json({
            message:"Failed to fetch interview info"
        })
    }
}

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Resume upload controller
const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "resumes",
            secure: true,
            max_size: 2* 1024 * 1024, // 2MB
        });
        fs.unlinkSync(req.file.path);
        req.resumeUrl = result.secure_url;
        next();
    } catch (error) {
        console.error("Resume upload error:", error);
        res.status(500).json({ message: "Failed to upload resume" });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "avatars",
            resource_type: "image",
            secure: true,
            max_size: 5* 1024 * 1024, // 10MB
        });
        fs.unlinkSync(req.file.path);
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { image: result.secure_url },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Avatar uploaded successfully", avatarUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: "Avatar upload failed", error: error.message });
    }
};

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
    googleAuthCode,
    getInterviewInfo,
    uploadResume,
    uploadAvatar
};