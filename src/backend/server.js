const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const profileRoutes = require("./routes/profile");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/profile", profileRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});