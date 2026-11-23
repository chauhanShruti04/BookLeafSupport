
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const ticketModel = require("../Model/ticketSchema");
const bookModel = require("../Model/bookSchema");
const authMiddleware = require("../Middleware/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" +
            Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDF files are allowed"));
        }
    },
});

router.post(
    "/createTicket",
    authMiddleware,
    upload.single("attachment"),
    async (req, res) => {
        try {
            const {
                bookId,
                category,
                subject,
                description,
            } = req.body;

            if (!category || !subject?.trim() || !description?.trim()) {
                return res.status(400).json({
                    status: false,
                    message: "Please provide all required ticket details",
                });
            }

            let selectedBook = null;

            if (bookId) {
                selectedBook = await bookModel.findOne({
                    _id: bookId,
                    author: req.user._id,
                });

                if (!selectedBook) {
                    return res.status(404).json({
                        status: false,
                        message: "Book not found",
                    });
                }
            }

            const ticket = await ticketModel.create({
                author: req.user._id,
                book: selectedBook?._id || null,
                bookTitle: selectedBook?.title || "General / Account Level",
                category,
                subject: subject.trim(),
                description: description.trim(),
                attachment: req.file ? req.file.path : "",
            });

            return res.status(201).json({
                status: true,
                message: "Ticket created successfully",
                result: ticket,
            });

        } catch (error) {
            console.log("Create Ticket Error:", error);

            return res.status(500).json({
                status: false,
                message: "Failed to create ticket",
                error: error.message,
            });
        }
    }
);

router.get("/myTickets", authMiddleware, async (req, res) => {
    try {
        const tickets = await ticketModel.find({
            author: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: "Tickets fetched successfully",
            result: tickets,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch tickets",
            error: error.message,
        });
    }
});

router.get("/allTickets", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                status: false,
                message: "Access denied",
            });
        }

        const tickets = await ticketModel.find()
            .populate("author", "name email")
            .populate("book", "title isbn")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: "All tickets fetched successfully",
            result: tickets,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch tickets",
            error: error.message,
        });
    }
});

module.exports = router;
