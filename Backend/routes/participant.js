const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Participant = require("../models/participant");
const Group = require("../models/group");
const Event = require("../models/event");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      ParticipantName,
      ParticipantEnrollmentNumber,
      ParticipantInstituteName,
      ParticipantCity,
      ParticipantMobile,
      ParticipantEmail,
      IsGroupLeader,
      GroupID
    } = req.body;

    if (!ParticipantName || !ParticipantEnrollmentNumber || !GroupID) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const participant = await Participant.create({
      ParticipantName,
      ParticipantEnrollmentNumber,
      ParticipantInstituteName,
      ParticipantCity,
      ParticipantMobile,
      ParticipantEmail,
      IsGroupLeader,
      GroupID,
      ModifiedBy: req.user._id
    });

    res.status(201).json({ message: "Participant added successfully", participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json({ participants });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Object ID" });
    }

    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const group = await Group.findById(participant.GroupID);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isGroupLeader = await Participant.exists({
      GroupID: group._id,
      IsGroupLeader: true,
      ModifiedBy: userId
    });


    const event = await Event.findById(group.EventID);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isEventCoordinator =
      event.EventCoOrdinatorID.toString() === userId.toString();

    if (!isGroupLeader && !isEventCoordinator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedUpdates = [
      "ParticipantName",
      "ParticipantInstituteName",
      "ParticipantCity",
      "ParticipantMobile",
      "ParticipantEmail",
      "IsGroupLeader"
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        participant[field] = req.body[field];
      }
    });

    participant.ModifiedBy = userId;

    await participant.save();

    res.status(200).json({
      message: "Participant updated successfully",
      participant
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Object ID" });
    }

    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const group = await Group.findById(participant.GroupID);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isGroupLeader = await Participant.exists({
      GroupID: group._id,
      IsGroupLeader: true,
      ModifiedBy: userId
    });

    const event = await Event.findById(group.EventID);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isEventCoOrdinator = event.EventCoOrdinatorID.toString() === userId.toString();
    if (!isGroupLeader && !isEventCoOrdinator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deletedParticipant = await Participant.findByIdAndDelete(id);
    res.status(200).json({ message: "Participant deleted successfully", deletedParticipant });

  }
  catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = router;
