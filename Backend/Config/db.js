const mongoose = require('mongoose');
const config = require('./development.json');

mongoose.connect(`${config["MONGODB-URL"]}/bookleaf_portal`)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

module.exports = mongoose.connection;