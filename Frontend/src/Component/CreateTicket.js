
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Pages/Sidebar";
import {
  getBookAPI,
  createTicketAPI,
} from "../util/ApiList";
import Swal from "sweetalert2";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookId: "",
    category: "General Inquiry",
    subject: "",
    description: "",
    attachment: null,
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(getBookAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
          throw new Error(data.message || "Failed to fetch books");
        }

        setBooks(data.result || []);
      } catch (err) {
        setError(err.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "attachment" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();

      payload.append("bookId", formData.bookId);
      payload.append("category", formData.category);
      payload.append("subject", formData.subject.trim());
      payload.append("description", formData.description.trim());

      if (formData.attachment) {
        payload.append("attachment", formData.attachment);
      }

      const response = await fetch(createTicketAPI, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "Failed to create ticket");
      }

      await Swal.fire(
        "Success",
        "Ticket created successfully!",
        "success"
      );

      setFormData({
        bookId: "",
        category: "General Inquiry",
        subject: "",
        description: "",
        attachment: null,
      });

      navigate("/author/ticket");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-heading">
          <div>
            <h1>Create Support Ticket</h1>
            <p>Tell us how we can help you.</p>
          </div>
        </div>

        <form className="ticket-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label>Book *</label>

            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading books..." : "General / Account Level"}
              </option>

              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Category *</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>General Inquiry</option>
              <option>Royalty & Payments</option>
              <option>ISBN & Metadata Issues</option>
              <option>Printing & Quality</option>
              <option>Distribution & Availability</option>
              <option>Book Status & Production Updates</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject *</label>

            <input
              type="text"
              name="subject"
              placeholder="Enter your query subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>

            <textarea
              name="description"
              placeholder="Describe your issue in detail..."
              rows="6"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Attachment (optional)</label>

            <input
              type="file"
              name="attachment"
              accept="image/*,.pdf"
              onChange={handleChange}
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={submitting || loading}
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateTicket;
