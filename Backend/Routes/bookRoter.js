const express = require('express');
const router = express.Router();
const bookModel = require("../Model/bookSchema");
const userModel = require("../Model/userSchema");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/myBooks", authMiddleware, async (req, resp) => {
    try {
        const books = await bookModel.find({
            author: req.user._id,
        }).sort({ createdAt: -1 });

        return resp.status(200).json({
            status: true,
            message: "Books fetched successfully",
            result: books,
        });
    } catch (error) {
        return resp.status(500).json({
            status: false,
            message: "Failed to fetch books",
        });
    }
});

router.post("/createBook", authMiddleware, async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                status: false,
                message: "Only admins can add books",
            });
        }

        const {
            title,
            isbn,
            genre,
            publicationDate,
            status,
            mrp,
            authorId,
        } = req.body;

        if (
            !title?.trim() ||
            !isbn?.trim() ||
            !genre?.trim() ||
            !publicationDate ||
            mrp === undefined ||
            !authorId
        ) {
            return resp.status(400).json({
                status: false,
                message: "Please provide all required book details",
            });
        }

        if (!Number.isFinite(Number(mrp)) || Number(mrp) < 0) {
            return resp.status(400).json({
                status: false,
                message: "MRP must be a valid non-negative number",
            });
        }

        if (!Number.isFinite(Date.parse(publicationDate))) {
            return resp.status(400).json({
                status: false,
                message: "Invalid publication date",
            });
        }

        if (
            status &&
            !["Draft", "Published", "Out of Print"].includes(status)
        ) {
            return resp.status(400).json({
                status: false,
                message: "Invalid book status",
            });
        }

        const author = await userModel.findOne({
            _id: authorId,
            role: "author",
        });

        if (!author) {
            return resp.status(404).json({
                status: false,
                message: "Author not found",
            });
        }

        const existingBook = await bookModel.findOne({
            isbn: isbn.trim(),
        });

        if (existingBook) {
            return resp.status(409).json({
                status: false,
                message: "A book with this ISBN already exists",
            });
        }

        const book = await bookModel.create({
            title: title.trim(),
            isbn: isbn.trim(),
            genre: genre.trim(),
            publicationDate,
            status,
            mrp: Number(mrp),
            author: author._id,
        });

        return resp.status(201).json({
            status: true,
            message: "Book created successfully",
            result: book,
        });
    } catch (error) {

        return resp.status(500).json({
            status: false,
            message: "Failed to create book",
            err: error.message
        });
    }
});

router.get("/allBooks", authMiddleware, async (req, resp) => {
    try {
        if (req.user.role !== "admin") {
            return resp.status(403).json({
                status: false,
                message: "Access denied",
            });
        }

        const books = await bookModel.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return resp.status(200).json({
            status: true,
            message: "All books fetched successfully",
            result: books,
        });

    } catch (error) {
        return resp.status(500).json({
            status: false,
            message: "Failed to fetch books",
            error: error.message,
        });
    }
});

module.exports = router;