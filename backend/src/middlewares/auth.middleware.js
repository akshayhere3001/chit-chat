import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// we will get the token from the cookie
export const protectRoute = async (req, res, next) => {
    try {
        // .token because we name as "token" in generateToken function
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message: "Unauthorized User"});   
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            return res.status(400).json({message: "Failed To Verify Token"}); 
        }
        
        const user = await User.findById(decodedToken._id).select("-password");

        if(!user){
            return res.status(404).json({message: "User not Found"});
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("Error while validating token: ", error.message)
        return res.status(500).json({message: "Failed To Validate Token"});
    }
}