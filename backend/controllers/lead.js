const Lead = require("../models/lead");

/**
 * Maps database Mongoose documents to standard client-friendly lead objects.
 */
function formatLead(doc) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj.leadId || String(obj._id),
  };
}

/**
 * GET /admin/leads
 * Retrieves all leads with optional stage, grade, search query, or caller filter.
 */
exports.get_leads = async (req, res) => {
  try {
    const { stage, grade, search, caller } = req.query;
    const filter = {};

    if (stage) filter.stage = stage;
    if (grade) filter.grade = grade;
    if (caller) filter.caller = caller;

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { student: regex },
        { parent: regex },
        { phone: regex },
        { leadId: regex },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    return res.json({
      isSuccessful: true,
      message: "Leads retrieved successfully",
      leads: leads.map(formatLead),
    });
  } catch (err) {
    console.error("Error fetching leads:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to retrieve leads",
      error: err.message,
    });
  }
};

/**
 * GET /admin/leads/stats
 * Aggregates high-level conversion and operational queue metrics.
 */
exports.get_stats = async (req, res) => {
  try {
    const now = new Date();
    const total = await Lead.countDocuments();
    const dueCalls = await Lead.countDocuments({
      stage: { $in: ["ENQUIRY", "INTERESTED"] },
      due: { $lte: now, $ne: null },
    });
    const readyForTest = await Lead.countDocuments({ stage: "READY_FOR_CBT" });
    const converted = await Lead.countDocuments({ stage: "CONVERTED" });

    return res.json({
      isSuccessful: true,
      stats: { total, dueCalls, readyForTest, converted },
    });
  } catch (err) {
    console.error("Error in lead stats:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to calculate lead metrics",
      error: err.message,
    });
  }
};

/**
 * GET /admin/leads/:id
 * Fetches a single lead dossier by leadId or _id.
 */
exports.get_lead_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({
      $or: [{ leadId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!lead) {
      return res.status(404).json({ isSuccessful: false, message: "Enquiry not found" });
    }

    return res.json({
      isSuccessful: true,
      lead: formatLead(lead),
    });
  } catch (err) {
    return res.status(500).json({
      isSuccessful: false,
      message: "Error retrieving enquiry",
      error: err.message,
    });
  }
};

/**
 * POST /admin/leads/create
 * Clerk intake action: records new applicant and routes to caller desk or CBT.
 */
exports.create_lead = async (req, res) => {
  try {
    const {
      student,
      parent,
      phone,
      alternate,
      grade,
      source,
      cycle = "2027/28",
      routeToTest,
      note,
    } = req.body;

    if (!student || !parent || !phone || !grade) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Student name, parent name, phone, and grade are required.",
      });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    const count = await Lead.countDocuments();
    const leadId = req.body.leadId || `AC-2027-${String(count + 1).padStart(3, "0")}`;

    const initialStage = routeToTest ? "READY_FOR_CBT" : "ENQUIRY";
    const nextAction = routeToTest
      ? "Schedule entrance test (CBT)"
      : "Arrange welcome call";

    const initialHistory = [
      {
        actor: req.user?.name || "Front desk clerk",
        at: new Date(),
        text: note
          ? `Enquiry registered: ${note.trim()}`
          : `Enquiry registered via ${source || "Walk-in"}. ${
              routeToTest ? "Routed directly to CBT Evaluation." : "Queued for counseling call."
            }`,
      },
    ];

    const lead = new Lead({
      leadId,
      student: student.trim(),
      parent: parent.trim(),
      phone: cleanPhone,
      alternate: alternate ? String(alternate).trim() : "",
      grade: String(grade),
      source: source || "Walk-in",
      cycle,
      stage: initialStage,
      caller: routeToTest ? null : "usr-1",
      nextAction,
      due: routeToTest ? null : new Date(),
      lastOutcome: note || "New clerk intake registered at admissions counter.",
      history: initialHistory,
    });

    await lead.save();

    return res.status(201).json({
      isSuccessful: true,
      message: "Enquiry successfully recorded",
      lead: formatLead(lead),
    });
  } catch (err) {
    console.error("Error creating lead:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to record enquiry",
      error: err.message,
    });
  }
};

/**
 * POST /admin/leads/outcome
 * Counselor call outcome recorder: logs interaction, schedules callback, or hands off to CBT.
 */
exports.record_outcome = async (req, res) => {
  try {
    const { id, outcome, note, due, nextStage, nextAction } = req.body;

    if (!id || !outcome) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Lead ID and outcome are required.",
      });
    }

    const lead = await Lead.findOne({
      $or: [{ leadId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!lead) {
      return res.status(404).json({ isSuccessful: false, message: "Lead not found" });
    }

    if (nextStage) lead.stage = nextStage;
    if (nextAction) lead.nextAction = nextAction;
    lead.due = due ? new Date(due) : null;
    lead.lastOutcome = outcome + (note ? ` - ${note.trim()}` : "");

    lead.history.push({
      actor: req.user?.name || "Admissions Counselor",
      at: new Date(),
      text: note ? `Outcome: ${outcome}. Note: ${note.trim()}` : `Outcome: ${outcome}`,
    });

    await lead.save();

    return res.json({
      isSuccessful: true,
      message: "Call outcome saved successfully",
      lead: formatLead(lead),
    });
  } catch (err) {
    console.error("Error saving call outcome:", err);
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to save call outcome",
      error: err.message,
    });
  }
};

/**
 * POST /admin/leads/stage
 * Manual stage modification from applicant dossier.
 */
exports.update_stage = async (req, res) => {
  try {
    const { id, stage } = req.body;
    if (!id || !stage) {
      return res.status(400).json({ isSuccessful: false, message: "ID and stage are required" });
    }

    const lead = await Lead.findOne({
      $or: [{ leadId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!lead) {
      return res.status(404).json({ isSuccessful: false, message: "Lead not found" });
    }

    lead.stage = stage;
    lead.history.push({
      actor: req.user?.name || "Admin",
      at: new Date(),
      text: `Stage manually changed to ${stage}`,
    });

    await lead.save();

    return res.json({
      isSuccessful: true,
      message: "Stage updated successfully",
      lead: formatLead(lead),
    });
  } catch (err) {
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to update stage",
      error: err.message,
    });
  }
};

/**
 * POST /admin/leads/note
 * Appends internal counsel note to the applicant activity timeline.
 */
exports.add_note = async (req, res) => {
  try {
    const { id, note } = req.body;
    if (!id || !note) {
      return res.status(400).json({ isSuccessful: false, message: "ID and note are required" });
    }

    const lead = await Lead.findOne({
      $or: [{ leadId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!lead) {
      return res.status(404).json({ isSuccessful: false, message: "Lead not found" });
    }

    lead.history.push({
      actor: req.user?.name || "Admissions Officer",
      at: new Date(),
      text: note.trim(),
    });

    await lead.save();

    return res.json({
      isSuccessful: true,
      message: "Note added successfully",
      lead: formatLead(lead),
    });
  } catch (err) {
    return res.status(500).json({
      isSuccessful: false,
      message: "Failed to add note",
      error: err.message,
    });
  }
};

/**
 * POST /admin/leads/seed
 * Populates initial realistic scenarios if collection is empty.
 */
exports.seed_leads = async (req, res) => {
  try {
    const existing = await Lead.countDocuments();
    if (existing > 0) {
      return res.json({ isSuccessful: true, message: "Collection already initialized" });
    }

    const seedData = [
      {
        leadId: "AC-2027-001",
        school: "Acadza Greenfield School",
        student: "Aarav Mehta",
        parent: "Sanjay Mehta",
        phone: "9820112233",
        alternate: "9820112234",
        grade: "11",
        source: "Walk-in",
        cycle: "2027/28",
        stage: "ENQUIRY",
        caller: "usr-1",
        nextAction: "Arrange welcome call",
        due: new Date(),
        lastOutcome: "Parent visited front desk; inquired for 2-year JEE coaching + schooling.",
        history: [
          {
            actor: "Front desk clerk",
            at: new Date(),
            text: "Enquiry recorded at school counter. Parent requested information pack.",
          },
        ],
      },
      {
        leadId: "AC-2027-002",
        school: "Acadza Greenfield School",
        student: "Diya Sharma",
        parent: "Ramesh Sharma",
        phone: "9871122334",
        alternate: "",
        grade: "12",
        source: "Phone",
        cycle: "2027/28",
        stage: "INTERESTED",
        caller: "usr-1",
        nextAction: "Discuss syllabus & batches",
        due: new Date(Date.now() + 86400000),
        lastOutcome: "Parent interested in Physics and Maths revision batch.",
        history: [
          {
            actor: "Front desk clerk",
            at: new Date(),
            text: "Phone enquiry taken. Student currently studying in Class 12.",
          },
        ],
      },
      {
        leadId: "AC-2027-003",
        school: "Acadza Greenfield School",
        student: "Kabir Singhania",
        parent: "Anita Singhania",
        phone: "9819988776",
        alternate: "9819988770",
        grade: "10",
        source: "Referral",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: null,
        lastOutcome: "Passed clerk intake; opted straight for entrance evaluation.",
        history: [
          {
            actor: "Front desk clerk",
            at: new Date(),
            text: "New enquiry taken. Mother requested direct entrance test slot.",
          },
        ],
      },
    ];

    await Lead.insertMany(seedData);
    return res.json({ isSuccessful: true, message: "Database seeded successfully" });
  } catch (err) {
    return res.status(500).json({ isSuccessful: false, message: err.message });
  }
};

