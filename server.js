const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection for User DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to User MongoDB"))
  .catch((err) => console.error("User MongoDB connection error:", err));

// MongoDB Connection for Payment DB
const paymentDbConnection = mongoose.createConnection(
  process.env.PAYMENT_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

paymentDbConnection.on("connected", () => {
  console.log("Connected to Payment MongoDB");
});

paymentDbConnection.on("error", (err) => {
  console.error("Payment MongoDB connection error:", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  branch: String,
});

// Define User Model
const User = mongoose.model("User", userSchema);

// API to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Update Payment Schema to include status
const paymentSchema = new mongoose.Schema({
  serviceType: String,
  clothesType: String,
  pairs: Number,
  pickupDate: String,
  totalPrice: Number,
  username: String,
  branch: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // New field for request status
});

app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
});
// Accept Laundry Request Endpoint
app.put("/api/payments/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., status: "Accepted"

  // Update the status in the database
  Payment.findByIdAndUpdate(id, { status: status }, { new: true })
    .then((updatedPayment) => {
      res.status(200).json(updatedPayment); // Send the updated payment data back to the client
    })
    .catch((error) => {
      console.error("Error updating payment status:", error);
      res.status(500).send("Error updating payment status");
    });
});

// Define Payment Model (for dynamic collection names based on serviceType)
const Payment = paymentDbConnection.model("Payment", paymentSchema);

// Register Endpoint
app.post("/register", async (req, res) => {
  const { name, email, password, branch } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already registered" });
    }

    const user = new User({ name, email, password, branch });
    await user.save();
    res.status(201).send({ message: "Registration successful" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password, branch } = req.body;

  try {
    const user = await User.findOne({ email, password, branch });
    if (user) {
      res.status(200).send({
        message: "Login successful",
        username: user.name, // Include username
        branch: user.branch,
      });
    } else {
      res
        .status(401)
        .send({ message: "Invalid credentials or branch selection" });
    }
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// Payment Endpoint
app.post("/payment", async (req, res) => {
  const {
    serviceType,
    clothesType,
    pairs,
    pickupDate,
    totalPrice,
    username,
    branch,
  } = req.body;

  try {
    const paymentData = new Payment({
      serviceType,
      clothesType,
      pairs,
      pickupDate,
      totalPrice,
      username, // Include username
      branch, // Include branch
    });

    await paymentData.save();
    res
      .status(200)
      .send({ message: "Payment processed and saved successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Error processing payment", error: err });
  }
});

//fetches karnataka info
app.get("/api/payments/pending/karnataka", async (req, res) => {
  try {
    const pendingPayments = await Payment.find({
      status: "Pending",
      branch: "Karnataka",
    });
    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending payments", error });
  }
});

app.get("/getRequestsByStatus", (req, res) => {
  const status = req.query.status;
  Payment.find({ status })
    .then((requests) => {
      res.json(requests);
    })
    .catch((error) => {
      console.error("Error fetching requests:", error);
      res.status(500).send("Server Error");
    });
});
app.get("/api/payments/pending/karnataka", async (req, res) => {
  const { username } = req.query; // Get the logged-in username from the query

  try {
    const pendingPayments = await Payment.find({
      status: "Pending",
      branch: "Karnataka",
      username: username, // Filter by username
    });
    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending payments", error });
  }
});
app.get("/getRequestsByStatus", (req, res) => {
  const { status, username } = req.query; // Get the status and username from the query

  Payment.find({ status, username })
    .then((requests) => {
      res.json(requests);
    })
    .catch((error) => {
      console.error("Error fetching requests:", error);
      res.status(500).send("Server Error");
    });
});
// Endpoint to fetch payment details by username
app.get("/api/payments/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const payments = await Payment.find({ username });
    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this user" });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment details", error });
  }
});

// Finish Laundry Request Endpoint
app.put("/api/payments/finish/:id", (req, res) => {
  const { id } = req.params;

  // Update the status in the database to "Finished"
  Payment.findByIdAndUpdate(id, { status: "Finished" }, { new: true })
    .then((updatedPayment) => {
      res.status(200).json(updatedPayment); // Send the updated payment data back to the client
    })
    .catch((error) => {
      console.error("Error updating payment status to Finished:", error);
      res.status(500).send("Error updating payment status to Finished");
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
