import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './db/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './utils/socket.js';
import path from 'path';

dotenv.config()
const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,      // this allow the cookies or the auth headers 
}))
app.use(express.json())

// routes
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

connectDb()
.then(
    server.listen(PORT || 5000, () => {
        console.log(`Server is listening at: ${PORT}`)
    })    
)
.catch((err) => {
    console.log("MongoDB connection Failed: ", err)
})

