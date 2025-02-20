import mongoose from 'mongoose';

const DB_NAME = "chat-app";
const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Error Occurred While Connecting DB: ", error)
        process.exit(1);
    }
}

export {connectDb};