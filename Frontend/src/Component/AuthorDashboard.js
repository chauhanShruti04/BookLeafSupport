
import {
  BookOpen,
  IndianRupee,
  Wallet,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { authorData, books, tickets } from "../Data/Mockdata";
import Sidebar from "../Pages/Sidebar";
import { getBookAPI, getMyTicketsAPI } from "../util/ApiList";
import { useEffect, useState } from "react";

function AuthorDashboard() {
  const [filter, setFilter] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // const data = await fetch(getBookAPI);
        const data = await fetch(getBookAPI, {
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

  const totalEarned = books.reduce(
    (total, book) => total + book.totalRoyaltyEarned,
    0
  );

  const totalPaid = books.reduce(
    (total, book) => total + book.royaltyPaid,
    0
  );

  const totalPending = books.reduce(
    (total, book) => total + book.royaltyPending,
    0
  );

  const totalCopiesSold = books.reduce(
    (total, book) => total + book.totalCopiesSold,
    0
  );

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      subtitle: "Your book titles",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Total Royalty Earned",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
      subtitle: "Lifetime earnings",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Royalty Paid",
      value: `₹${totalPaid.toLocaleString("en-IN")}`,
      subtitle: "Amount already paid",
      icon: Wallet,
      color: "purple",
    },
    {
      title: "Royalty Pending",
      value: `₹${totalPending.toLocaleString("en-IN")}`,
      subtitle: "Awaiting payment",
      icon: Clock,
      color: "orange",
    },
  ];

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

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* <Navbar /> */}

        <main className="dashboard-content">
          <div className="welcome-section">
            <div>
              <p className="eyebrow">AUTHOR WORKSPACE</p>
              <h1>Welcome back</h1>
              <p>
                Here's an overview of your books, earnings, and support.
              </p>
            </div>

            <Link to="/author/createticket" className="primary-button">
              + Create Support Ticket
            </Link>
          </div>

          <section className="overview-grid">
            <div className="content-card">
              <div className="section-header">
                <div>
                  <h2>My Books</h2>
                  <p>Your published titles and sales</p>
                </div>

                <Link to="/author/book" className="text-link">
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              {books.map((book) => (
                <div className="book-row" key={book.id}>
                  <div className="book-cover">
                    <BookOpen size={23} />
                  </div>

                  <div className="book-info">
                    <strong>{book.title}</strong>
                    <span>{book.totalCopiesSold} copies sold</span>
                  </div>

                  <span className="status-badge published">
                    {book.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="content-card royalty-card">
              <div className="section-header">
                <div>
                  <h2>Royalty Summary</h2>
                  <p>Your earnings at a glance</p>
                </div>
                <IndianRupee size={21} />
              </div>

              <div className="royalty-total">
                <span>Total earned</span>
                <h2>₹{totalEarned.toLocaleString("en-IN")}</h2>
              </div>

              <div className="royalty-line">
                <span>Paid</span>
                <strong>
                  ₹{totalPaid.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="royalty-line">
                <span>Pending</span>
                <strong>
                  ₹{totalPending.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="royalty-line">
                <span>Total copies sold</span>
                <strong>{totalCopiesSold}</strong>
              </div>

              <div className="royalty-progress">
                <div
                  style={{
                    width: `${totalEarned ? (totalPaid / totalEarned) * 100 : 0
                      }%`,
                  }}
                />
              </div>
              <p className="progress-caption">
                {totalEarned
                  ? Math.round((totalPaid / totalEarned) * 100)
                  : 0}
                % of earned royalties paid
              </p>
            </div>
          </section>

          <section className="content-card recent-tickets">
            <div className="section-header">
              <div>
                <h2>Recent Support Tickets</h2>
                <p>Track your latest queries</p>
              </div>

              <Link to="/author/ticket" className="text-link">
                View all <ArrowRight size={16} />
              </Link>
            </div>

            {tickets.length === 0 ? (
              <p className="empty-state">
                You haven't created any support tickets yet.
              </p>
            ) : (
              tickets.slice(0, 3).map((ticket) => (
                <div className="ticket-row" key={ticket.id}>
                  <div className="ticket-info">
                    <strong>{ticket.subject}</strong>
                    <span>
                      {ticket.id} · {ticket.category}
                    </span>
                  </div>

                  <span
                    className={`status-badge ${ticket.status === "Open" ? "open" : "in-progress"
                      }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default AuthorDashboard;
