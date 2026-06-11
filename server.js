require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const blogRoutes = require("./routes/blogRoutes");

app.use("/api/blogs", blogRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
});
const authRoutes =
  require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
