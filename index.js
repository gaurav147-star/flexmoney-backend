const express = require("express");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();
const app = express();
app.use(express.json()); // to accept json data
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API Running!");
});

// Routes
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
