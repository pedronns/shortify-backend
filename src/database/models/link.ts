import mongoose from "mongoose"
const { Schema } = mongoose

const linkSchema = new Schema(
    {
        url: { type: String, required: true, trim: true },
        code: { type: String, required: true, unique: true },
        clicks: { type: Number, default: 0 },
        passwordHash: String,
        protected: { type: Boolean, default: false },
        custom: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export const LinkModel = mongoose.model("Link", linkSchema)
