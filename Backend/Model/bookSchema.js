
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        genre: {
            type: String,
            required: true,
            trim: true,
        },
        publicationDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Published", "Out of Print"],
            default: "Draft",
        },
        mrp: {
            type: Number,
            required: true,
            min: 0,
        },
        totalCopiesSold: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalRoyaltyEarned: {
            type: Number,
            default: 0,
            min: 0,
        },
        royaltyPaid: {
            type: Number,
            default: 0,
            min: 0,
        },
        royaltyPending: {
            type: Number,
            default: 0,
            min: 0,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("book", bookSchema);
