
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MessageSquare } from "lucide-react";
import Sidebar from "../Pages/Sidebar";
import { getMyTicketsAPI } from "../util/ApiList";

function MyTickets() {
    const [filter, setFilter] = useState("All");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(getMyTicketsAPI, {
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

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">

                <div className="page-heading">
                    <div>
                        <h1>My Support Tickets</h1>
                        <p>Track your queries and support responses.</p>
                    </div>

                    <Link to="/author/create-ticket" className="primary-button">
                        <Plus size={18} />
                        Create Ticket
                    </Link>
                </div>

                <div className="ticket-filters">
                    {["All", "Open", "In Progress", "Resolved", "Closed"].map(
                        (status) => (
                            <button
                                key={status}
                                className={filter === status ? "filter-active" : ""}
                                onClick={() => setFilter(status)}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>

                {loading ? (
                    <p>Loading tickets...</p>
                ) : error ? (
                    <p className="form-error">{error}</p>
                ) : (
                    <div className="ticket-list">
                        {filteredTickets.length === 0 ? (
                            <div className="empty-state">
                                <MessageSquare size={32} />
                                <h3>No tickets found</h3>
                                <p>You have no tickets with this status.</p>
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <div className="ticket-card" key={ticket._id}>
                                    <div className="ticket-card-header">
                                        <div>
                                            <span className="ticket-id">
                                                {ticket.ticketId}
                                            </span>
                                            <h3>{ticket.subject}</h3>
                                        </div>

                                        <span
                                            className={`ticket-status ${ticket.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>

                                    <p className="ticket-description">
                                        {ticket.description}
                                    </p>

                                    <div className="ticket-meta">
                                        <span>{ticket.bookTitle}</span>
                                        <span>{ticket.category}</span>
                                        <span>
                                            {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                                        </span>
                                    </div>

                                    {ticket.priority && (
                                        <p>
                                            Priority: {ticket.priority}
                                        </p>
                                    )}

                                    {ticket.adminReply && (
                                        <div className="admin-reply">
                                            <strong>BookLeaf Support Reply</strong>
                                            <p>{ticket.adminReply}</p>
                                        </div>
                                    )}

                                    {ticket.attachment && (
                                        <a
                                            href={`http://localhost:5000/${ticket.attachment.replace(/\\/g, "/")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View Attachment
                                        </a>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyTickets;
