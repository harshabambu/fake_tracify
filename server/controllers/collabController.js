const Collaboration = require("../models/Collaboration"); // ✅ Declare only once
const User = require("../models/User");

// ✅ Search Users
exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email query required" });

    console.log("🔍 Searching for users with email containing:", email); // ✅ Debugging log

    const users = await User.find({ email: { $regex: email, $options: "i" } }).select("email _id");

    console.log("✅ Users found:", users); // ✅ Debugging log

    res.json(users);
  } catch (error) {
    console.error("🚨 Error searching users:", error);
    res.status(500).json({ error: "Error searching users" });
  }
};

// ✅ Send Request
const Collaboration = require("../models/Collaboration");

exports.sendRequest = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    
    if (sender === receiver) {
      return res.status(400).json({ error: "You cannot send a request to yourself" });
    }

    // ✅ Check if a request already exists
    const existingRequest = await Collaboration.findOne({
      $or: [
        { sender, receiver }, // Request from sender to receiver
        { sender: receiver, receiver: sender } // Request from receiver to sender (friendship already exists)
      ],
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent or pending" });
    }

    // ✅ Create a new friend request
    const request = new Collaboration({ sender, receiver, status: "pending" });
    await request.save();

    console.log("✅ Request sent:", request); // Debugging log
    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    console.error("🚨 Error sending request:", error);
    res.status(500).json({ error: "Error sending request" });
  }
};

// ✅ Accept Request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Collaboration.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status === "accepted") {
      return res.status(400).json({ error: "Request is already accepted" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error("🚨 Error in acceptRequest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Friends
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await Collaboration.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted",
    });

    res.json(friends);
  } catch (error) {
    console.error("🚨 Error in getFriends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Assign Task
exports.assignTask = async (req, res) => {
  try {
    const { senderId, receiverId, task } = req.body;
    // Logic to store assigned task in the database

    res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("🚨 Error in assignTask:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
