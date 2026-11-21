const express = require("express");
const router = express.Router();
const { adminAuth } = require("../utils/auth");
const leadController = require("../controllers/lead");

// Metrics & Stats
router.get("/stats", adminAuth, leadController.get_stats);

// Listing & Dossier
router.get("/", adminAuth, leadController.get_leads);
router.get("/:id", adminAuth, leadController.get_lead_by_id);

// Actions & Mutations
router.post("/create", adminAuth, leadController.create_lead);
router.post("/outcome", adminAuth, leadController.record_outcome);
router.post("/stage", adminAuth, leadController.update_stage);
router.post("/note", adminAuth, leadController.add_note);
router.post("/seed", adminAuth, leadController.seed_leads);

module.exports = router;

