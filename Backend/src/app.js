require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Routes
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Serve frontend only in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../public")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
}

module.exports = app;