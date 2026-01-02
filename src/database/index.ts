import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export async function connectDatabase() {
    const URI = process.env.MONGO_URI

    if(!URI) {
        throw new Error("MONGO_URI not defined in environment variables")
    }

    try {
        await mongoose.connect(URI)

        console.log("MongoDB connected successfuly")
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error connecting to MongoDB:", err.message)
            process.exit(1)
        }
        console.error("Error creating custom link:", err)
    }
}
