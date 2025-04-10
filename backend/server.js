require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timeLogRoutes = require('./routes/timeLog'); // use exact lowercase match



const app = express(); // Initialize express

// Middleware to handle CORS
// app.use(cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
        console.log("Request Origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));


// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/timeLog', timeLogRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);

//Server upload folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

// Start Server
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


///]]]