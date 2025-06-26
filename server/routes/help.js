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

module.exports = router;
