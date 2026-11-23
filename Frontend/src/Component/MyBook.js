
import { useEffect, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import Sidebar from "../Pages/Sidebar";
import { getBookAPI } from "../util/ApiList";

function MyBook() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        const result = await data.json();
        if (result.status) {
          setBooks(result.result);
        } else {
          setBooks([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || book.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* <Navbar /> */}

        <main className="dashboard-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">AUTHOR WORKSPACE</p>
              <h1>My Books</h1>
              <p>Manage your published books and track your royalties.</p>
            </div>

            <div className="book-count">
              <BookOpen size={20} />
              {books?.length} Books
            </div>
          </div>

          <section className="content-card">
            <div className="book-toolbar">
              <div className="book-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by title or ISBN"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by publication status"
              >
                <option value="All">All statuses</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Out of Print">Out of Print</option>
              </select>
            </div>

            {filteredBooks?.length === 0 ? (
              <div className="empty-state">
                No books match your search.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Book Details</th>
                      <th>Genre</th>
                      <th>Published On</th>
                      <th>Status</th>
                      <th>MRP</th>
                      <th>Copies Sold</th>
                      <th>Total Earned</th>
                      <th>Paid</th>
                      <th>Pending</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBooks?.map((book) => (
                      <tr key={book._id}>
                        <td>
                          <div className="table-book-title">
                            <strong>{book.title}</strong>
                            <span>ISBN: {book.isbn}</span>
                          </div>
                        </td>

                        <td>{book.genre}</td>

                        <td>
                          {new Date(
                            book.publicationDate + "T00:00:00"
                          ).toLocaleDateString("en-IN")}
                        </td>

                        <td>
                          <span
                          // className={`status-badge ${
                          //   book.status === "Published & Live"
                          //     ? "published"
                          //     : "open"
                          // }`}
                          >
                            {book.status}
                          </span>
                        </td>

                        <td>{formatCurrency(book.mrp)}</td>
                        <td>{(book.totalCopiesSold ?? 0).toLocaleString("en-IN")}</td>
                        <td>{formatCurrency(book.totalRoyaltyEarned ?? 0)}</td>
                        <td>{formatCurrency(book.royaltyPaid ?? 0)}</td>
                        <td>{formatCurrency(book.royaltyPending ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default MyBook;
