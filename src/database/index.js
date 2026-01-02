import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export async function connectDatabase() {
    const URI = process.env.MONGO_URI
    console.log(URI)

    try {
        await mongoose.connect(URI)

        console.log("MongoDB connected successfuly")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
        process.exit(1)
    }
}
