
export const authorData = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
};


export const books = [
  {
    id: "BK001",
    title: "Whispers of the Ganges",
    isbn: "978-93-5XXXX-01-1",
    genre: "Literary Fiction",
    publicationDate: "2023-06-20",
    status: "Published & Live",
    mrp: 399,
    totalCopiesSold: 342,
    totalRoyaltyEarned: 11970,
    royaltyPaid: 8400,
    royaltyPending: 3570,
  },
  {
    id: "BK002",
    title: "The Saffron Diaries",
    isbn: "978-93-5XXXX-02-8",
    genre: "Non-Fiction / Memoir",
    publicationDate: "2024-01-10",
    status: "Published & Live",
    mrp: 450,
    totalCopiesSold: 189,
    totalRoyaltyEarned: 7938,
    royaltyPaid: 7938,
    royaltyPending: 0,
  },
];



export const tickets = [
  {
    id: "TKT001",
    subject: "Royalty payment status",
    bookTitle: "Whispers of the Ganges",
    category: "Royalty & Payments",
    description:
      "I have not received my royalty payment for the previous quarter.",
    status: "In Progress",
    priority: "Medium",
    date: "2026-10-24",
    adminReply:
      "Your royalty statement is being reviewed. We will update you shortly.",
  },
  {
    id: "TKT002",
    subject: "Book availability on Amazon",
    bookTitle: "The Saffron Diaries",
    category: "Distribution & Availability",
    description:
      "My book is not showing as available on Amazon.",
    status: "Open",
    priority: "High",
    date: "2026-10-25",
    adminReply: "",
  },
];
