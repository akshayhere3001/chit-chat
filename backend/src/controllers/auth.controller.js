import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils/token.js";
import cloudinary from "../utils/cloudinary.js";

// steps: 
        // 1. get the data from the body
        // 2. validate the given data
        // 3. check if user already exists 
        // 4. hash the password
        // 5. if user upload an image then upload it to cloud
        // 6. returns the data without password
const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password){
            res.status(400).json({message: "All fields are Required"})
        }
        if(password.length < 6){
            res.status(400).json({message: "Password Length Should be above 6 Characters"})
        }

        // check if already exists
        const user = await User.findOne({email})
        
        if(user){
            res.status(400).json({message: "User Already Exists"})
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10) // 10 is salt/rounds
        
        // create user 
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        // if user created -- generate tokens
        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({message: "Invalid User Data"})
        }
        return newUser
    } catch (error) {
        console.log("Error Occurred While Creating User: ", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

// steps:
        // 1. get the data from the body
        // 2. validate the data
        // 3. check if user exists in db
        // 4. check if entered password is correct
        // 5. generate tokens -- token will expire in 7 days (so no refresh token used)
        // 6. return the data except password
const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password){
            res.status(400).json({message: "Please Enter Required Fields: Email and Password"})
        }

        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({message: "Invalid Credentials"});
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        
        if(!isPasswordValid){
            res.status(400).json({message: "Incorrect Password"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error While Logging the User: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// logout -- we have to just clear the cookie (where we set the "token" token)
const logout = async (_, res) => {
    try {
        res.cookie("token", "", {maxAge: 0});
        res.status(200).json({
            message: "User Logged Out Successfully"
        })
    } catch (error) {
       res.status(500).json({message: "Internal Server Error"})
       console.log("Failed To Logout: ", error.message); 
    }
}

const updateProfilePic = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // now we can access user because of protectRoute middleware

        if(!profilePic){
           return res.status(400).json({message: "Profile Picture is Required"}); 
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, 
            {
                profilePic: uploadResponse.secure_url 
            },  
            {new: true}
        )

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({message: "Failed To Update Profile Picture"});
        console.log("Internal Server Error: ", error.message)
    }
}

// this is needed for checking user if he is logged in or not
// like user refresh the page -- this api will hit to check
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in Check Auth Controller: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {signup, login, logout, updateProfilePic, checkAuth}