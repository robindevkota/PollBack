const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",             // allow requests from any origin
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb+srv://robindevkta0_db_user:ryq4JzUHORBOAN41@cluster0.jsqy6ds.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Routes
const userRoutes = require("./routes/userRoutes");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");

app.use("/api/votes", voteRoutes);

app.use("/api/users", userRoutes);
app.use("/api/polls", pollRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
