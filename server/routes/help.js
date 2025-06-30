// server/routes/help.js
const express = require("express");
const HelpRequest = require("../models/HelpRequest");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// 🔸 POST /api/help — Create Help Request
router.post("/", verifyToken, async (req, res) => {
  const { title, description, category, urgency, coordinates } = req.body;
  try {
    const help = new HelpRequest({
      requesterId: req.user.id,
      title,
      description,
      category,
      urgency,
      location: {
        type: "Point",
        coordinates,
      },
    });
    await help.save();
    res.status(201).json(help);
  } catch (err) {
    res.status(500).json({ message: "Error creating help request" });
  }
});

// 🔸 GET /api/help/nearby — Get Requests Near Me
router.get("/nearby", verifyToken, async (req, res) => {
  const { lng, lat } = req.query;
  try {
    const nearbyRequests = await HelpRequest.find({
      status: "pending",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000, // 5 km range
        },
      },
    }).populate("requesterId", "name email");

    res.json(nearbyRequests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching nearby help requests" });
  }
});

// 🔸 PATCH /api/help/:id/accept — Accept Request
router.patch("/:id/accept", verifyToken, async (req, res) => {
  try {
    const help = await HelpRequest.findById(req.params.id);
    if (!help || help.status !== "pending") return res.status(400).json({ message: "Invalid request" });

    help.status = "accepted";
    help.acceptedBy = req.user.id;
    await help.save();

    res.json({ message: "Request accepted", help });
  } catch (err) {
    res.status(500).json({ message: "Error accepting request" });
  }
});

// 🔸 PATCH /api/help/:id/complete — Complete Request
router.patch("/:id/complete", verifyToken, async (req, res) => {
  try {
    const help = await HelpRequest.findById(req.params.id);
    if (!help || help.status !== "accepted" || help.acceptedBy.toString() !== req.user.id) {
      return res.status(400).json({ message: "Unauthorized or invalid request" });
    }

    help.status = "completed";
    help.completedAt = new Date();
    await help.save();

    res.json({ message: "Request completed", help });
  } catch (err) {
    res.status(500).json({ message: "Error completing request" });
  }
});


// 🔸 GET /api/help/nearby — Get Requests Near Me (excluding user's own)
router.get("/nearby", verifyToken, async (req, res) => {
  try {
    let lng = parseFloat(req.query.lng);
    let lat = parseFloat(req.query.lat);

    // If not passed, fallback to user's profile location
    if (!lng || !lat) {
      const user = await require("../models/User").findById(req.user.id);
      if (!user || !user.location?.coordinates?.length) {
        return res.status(400).json({ message: "No location available" });
      }
      [lng, lat] = user.location.coordinates;
    }

    const nearbyRequests = await HelpRequest.find({
      status: "pending",
      requesterId: { $ne: req.user.id },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 5000,
        },
      },
    }).populate("requesterId", "name email");

    res.json(nearbyRequests);
  } catch (err) {
    console.error("Nearby error:", err);
    res.status(500).json({ message: "Error fetching nearby help requests" });
  }
});


// 🔸 GET /api/help/my-requests — Get requests created by logged-in user
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const myRequests = await HelpRequest.find({
      requesterId: req.user.id, // 🔸 Use `req.user.id`
    }).sort({ createdAt: -1 });

    res.json(myRequests);
  } catch (err) {
    console.error("Error in /my-requests:", err);
    res.status(500).json({ message: "Error fetching your help requests" });
  }
});

// 🔸 GET /api/help/my-requests — Fetch requests created by logged-in user
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const requests = await HelpRequest.find({ requesterId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your help requests" });
  }
});




module.exports = router;
