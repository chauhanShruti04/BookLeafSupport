
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Clock, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { tickets } from "../Data/Mockdata";
import { getAllBooksAPI, getAllTicketsAPI, getBookAPI } from "../util/ApiList";

function AdminDashboard() {
  const [filter, setFilter] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // const data = await fetch(getBookAPI);
        const data = await fetch(getAllBooksAPI, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const response = await data.json();
        setBooks(response.result || []);
      } catch (err) {
        setError(err.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(getAllTicketsAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
          throw new Error(data.message || "Failed to fetch tickets");
        }

        setTickets(data.result || []);

      } catch (err) {
        setError(err.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>BookLeaf Admin</h2>
        <p>Support Workspace</p>

        <Link to="/admin/dashboard" className="admin-nav-active">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/admin/books/create" className="admin-nav-active">
          <Plus size={18} />
          Create Book
        </Link>

        <button onClick={() => setFilter("All")}>
          All Tickets
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Support Dashboard</h1>
            <p>Manage author queries and support requests.</p>
          </div>
        </header>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <AlertCircle size={22} />
            <p>Open Tickets</p>
            <h2>{openTickets}</h2>
          </div>

          <div className="admin-stat-card">
            <Clock size={22} />
            <p>In Progress</p>
            <h2>{inProgressTickets}</h2>
          </div>

          <div className="admin-stat-card">
            <CheckCircle size={22} />
            <p>Resolved</p>
            <h2>{resolvedTickets}</h2>
          </div>
        </section>

        <section className="admin-ticket-section">
          <div className="admin-section-header">
            <h2>Book Management</h2>

            <Link to="/admin/books/create" className="create-book-btn">
              <Plus size={18} />
              Add New Book
            </Link>
          </div>

          {loading ? (
            <p>Loading books...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>ISBN</th>
                    <th>Genre</th>
                    <th>Publication Date</th>
                    <th>Status</th>
                    <th>MRP</th>
                    <th>Copies Sold</th>
                    <th>Total Royalty</th>
                    <th>Royalty Paid</th>
                    <th>Royalty Pending</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.isbn}</td>
                      <td>{book.genre}</td>
                      <td>
                        {book.publicationDate
                          ? new Date(book.publicationDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{book.status}</td>
                      <td>₹{book.mrp ?? 0}</td>
                      <td>{book.totalCopiesSold ?? 0}</td>
                      <td>₹{book.totalRoyaltyEarned ?? 0}</td>
                      <td>₹{book.royaltyPaid ?? 0}</td>
                      <td>₹{book.royaltyPending ?? 0}</td>
                    </tr>
                  ))}

                  {books.length === 0 && (
                    <tr>
                      <td colSpan="10">No books found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-ticket-section">
          <div className="admin-section-header">
            <h2>Support Tickets</h2>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Tickets</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketId}</td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.priority || "Medium"}</td>
                    <td>
                      <span
                        className={`ticket-status ${ticket.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.date}</td>
                    <td>
                      <Link to={`/admin/tickets/${ticket.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="7">No tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
