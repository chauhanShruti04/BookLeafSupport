
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { tickets } from "../Data/Mockdata";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = tickets.find((item) => item.id === id);

  const [status, setStatus] = useState(ticket?.status || "Open");
  const [priority, setPriority] = useState(
    ticket?.priority || "Medium"
  );
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");

  if (!ticket) {
    return (
      <div className="admin-main">
        <h2>Ticket not found</h2>
        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  const handleSave = () => {
    ticket.status = status;
    ticket.priority = priority;
    setMessage("Ticket details updated successfully.");
  };

  const handleReply = (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      setMessage("Please enter a reply.");
      return;
    }

    ticket.adminReply = reply.trim();
    setReply("");
    setMessage("Reply saved successfully.");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>BookLeaf Admin</h2>
        <p>Support Workspace</p>

        <Link to="/admin/dashboard">Dashboard</Link>
      </aside>

      <main className="admin-main">
        <Link to="/admin/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Tickets
        </Link>

        <div className="admin-header ticket-detail-heading">
          <div>
            <span className="ticket-id">{ticket.id}</span>
            <h1>{ticket.subject}</h1>
            <p>Submitted on {ticket.date}</p>
          </div>
        </div>

        {message && <p className="ticket-message">{message}</p>}

        <div className="ticket-detail-grid">
          <section className="ticket-detail-card">
            <h2>Author Query</h2>

            <div className="detail-field">
              <strong>Book</strong>
              <p>{ticket.bookTitle}</p>
            </div>

            <div className="detail-field">
              <strong>Category</strong>
              <p>{ticket.category}</p>
            </div>

            <div className="detail-field">
              <strong>Description</strong>
              <p>{ticket.description}</p>
            </div>

            <div className="detail-field">
              <strong>Current Admin Reply</strong>
              <p>{ticket.adminReply || "No reply sent yet."}</p>
            </div>
          </section>

          <section className="ticket-detail-card">
            <h2>Manage Ticket</h2>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={handleSave}
            >
              Save Changes
            </button>

            <hr />

            <h2>Reply to Author</h2>

            <form onSubmit={handleReply}>
              <div className="form-group">
                <label>Response</label>
                <textarea
                  rows="5"
                  placeholder="Write a helpful response to the author..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </div>

              <button className="primary-button" type="submit">
                Send Reply
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TicketDetails;
