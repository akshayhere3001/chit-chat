import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({_id: userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d" // 7 days in ms
    });

    const options = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"  // since we are development and our localhost is not secure means it is http (not https) that is why it will be false, it will switch to true once we change to production
    }
    res.cookie("token", token, options)

    return token;
}