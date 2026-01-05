import mongoose from "mongoose"
import { env } from "../config/env.ts"

export async function connectDatabase() {
    const URI = env.mongoUri

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
