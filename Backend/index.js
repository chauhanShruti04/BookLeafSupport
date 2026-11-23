const express = require('express');
const db = require("./Config/db");
require('dotenv').config();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const authRouter = require("./Routes/authRoute");
const bookRouter = require("./Routes/bookRoter");
const authorRoute = require("./Routes/authorRoute");
const ticketRoute = require("./Routes/ticketRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/auth", authRouter);
app.use("/book", bookRouter);
app.use("/api", authorRoute);
app.use("/ticket", ticketRoute);

// app.get("/", (req, resp) => {
//     send("hello")
// });

app.listen(5000);