import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createBookAPI, getAuthorAPI } from "../util/ApiList";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./CreateBook.css";



function CreateBook() {
    const [form, setForm] = useState({
        title: "",
        isbn: "",
        genre: "",
        publicationDate: "",
        status: "Draft",
        mrp: "",
        authorId: "",
    });
    const [authors, setAuthors] = useState([]);
    const [authorsLoading, setAuthorsLoading] = useState(true);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                // const data = await fetch(getAuthorAPI);
                const data = await fetch(getAuthorAPI, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const result = await data.json();
                if (result.status) {
                    setAuthors(result?.authors || []);
                } else {
                    setAuthors([]);
                }

            } catch (error) {
                Swal.fire("Error", error.message || "Failed to fetch authors", "error");
            } finally {
                setAuthorsLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                title: form.title || "",
                isbn: form.isbn || "",
                genre: form.genre || "",
                publicationDate: form.publicationDate || "",
                status: form.status || "",
                mrp: Number(form.mrp) || 0,
                authorId: form.authorId || "",
            };

            const token = localStorage.getItem("token");

            const result = await fetch(createBookAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await result.json();

            if (data.status) {
                await Swal.fire(
                    "Success",
                    "Book created successfully!",
                    "success"
                );

                setForm({
                    title: "",
                    isbn: "",
                    genre: "",
                    publicationDate: "",
                    status: "Draft",
                    mrp: "",
                    authorId: "",
                });
            } else {
                Swal.fire("Error", data.message, "error");
            }

        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create book", "error");
        }
    };
    return (
        <div className="create-book-page">
            <div className="create-book-container">
                <Link to="/admin/dashboard" className="back-button">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="create-book-heading">
                    <h2>Create New Book</h2>
                    <p>Enter the book details and assign it to an author.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Book Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="isbn">ISBN</label>
                        <input
                            id="isbn"
                            type="text"
                            name="isbn"
                            value={form.isbn}
                            onChange={handleChange}
                            placeholder="Enter ISBN"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre">Genre</label>
                        <input
                            id="genre"
                            type="text"
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            placeholder="e.g. Fiction, Education"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="publicationDate">Publication Date</label>
                        <input
                            id="publicationDate"
                            type="date"
                            name="publicationDate"
                            value={form.publicationDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Out of Print">Out of Print</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="mrp">MRP (₹)</label>
                        <input
                            id="mrp"
                            type="number"
                            name="mrp"
                            value={form.mrp}
                            onChange={handleChange}
                            placeholder="Enter book price"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="authorId">Select Author</label>

                        <select
                            id="authorId"
                            name="authorId"
                            value={form.authorId}
                            onChange={handleChange}
                            required
                            disabled={authorsLoading}
                        >
                            <option value="">
                                {authorsLoading ? "Loading authors..." : "Select an author"}
                            </option>

                            {authors.map((author) => (
                                <option key={author._id} value={author._id}>
                                    {author.name} ({author.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-book-button">
                            Create Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateBook;