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
    // Derive the next ID from the highest existing number, not the document count.
    // Counting collides with existing IDs once the sequence has gaps (e.g. 001-003, 006-009, 015...).
    let leadId = req.body.leadId;
    if (!leadId || (await Lead.exists({ leadId }))) {
      const existingIds = await Lead.find({ leadId: /^AC-2027-\d+$/ }).select("leadId").lean();
      const maxSeq = existingIds.reduce(
        (max, d) => Math.max(max, parseInt(d.leadId.split("-")[2], 10) || 0),
        0
      );
      leadId = `AC-2027-${String(maxSeq + 1).padStart(3, "0")}`;
    }

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
          : `Enquiry registered via ${source || "Walk-in"}. ${routeToTest ? "Routed directly to CBT Evaluation." : "Queued for counseling call."
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
    const { id, outcome, note, due, nextStage, nextAction, testConfig, testPaper, testResult, actor } = req.body;

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
    if (testConfig !== undefined) lead.testConfig = testConfig;
    if (testPaper !== undefined) lead.testPaper = testPaper;
    if (testResult !== undefined) lead.testResult = testResult;
    lead.due = due ? new Date(due) : null;
    lead.lastOutcome = outcome + (note ? ` - ${note.trim()}` : "");

    lead.history.push({
      actor: actor || req.user?.name || "Admissions Counselor",
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
        leadId: "AC-2027-008",
        school: "Acadza Greenfield School",
        student: "Vihaan Reddy",
        parent: "Venkat Reddy",
        phone: "9844556677",
        alternate: "9844556678",
        grade: "8",
        source: "Referral",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Referred by existing parent. Applying for Grade 8 admission.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Candidate queued for Grade 8 CBT." }],
      },
      {
        leadId: "AC-2027-015",
        school: "Acadza Greenfield School",
        student: "Tanvi Deshpande",
        parent: "Sudhir Deshpande",
        phone: "9844778811",
        alternate: "",
        grade: "8",
        source: "Website",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Online application submitted for Grade 8. Ready for CBT.",
        history: [{ actor: "Web Admissions Portal", at: new Date(), text: "Registered online for Grade 8 entrance test." }],
      },
      {
        leadId: "AC-2027-016",
        school: "Acadza Greenfield School",
        student: "Atharva Bhat",
        parent: "Narayanan Bhat",
        phone: "9844778899",
        alternate: "",
        grade: "8",
        source: "Website",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Candidate for Grade 8. Ready for entrance evaluation.",
        history: [{ actor: "Web Admissions Portal", at: new Date(), text: "Registered online for Grade 8 entrance test." }],
      },
      {
        leadId: "AC-2027-022",
        school: "Acadza Greenfield School",
        student: "Advait Joshi",
        parent: "Makarand Joshi",
        phone: "9844889900",
        alternate: "",
        grade: "8",
        source: "Walk-in",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Walk-in enquiry for Class 8 middle school admission.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Candidate queued for Grade 8 CBT." }],
      },
      {
        leadId: "AC-2027-023",
        school: "Acadza Greenfield School",
        student: "Anika Kulkarni",
        parent: "Prasad Kulkarni",
        phone: "9844991122",
        alternate: "",
        grade: "8",
        source: "Referral",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Sibling studying in school. Applying for Class 8 admission.",
        history: [{ actor: "Admissions Officer", at: new Date(), text: "Queued for Grade 8 CBT test." }],
      },
      {
        leadId: "AC-2027-006",
        school: "Acadza Greenfield School",
        student: "Reyansh Verma",
        parent: "Sunil Verma",
        phone: "9820223344",
        alternate: "9820223345",
        grade: "6",
        source: "Walk-in",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Enquired for Grade 6 middle school admission. Ready for CBT evaluation.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Candidate queued for CBT." }],
      },
      {
        leadId: "AC-2027-007",
        school: "Acadza Greenfield School",
        student: "Aanya Patel",
        parent: "Kiran Patel",
        phone: "9833445566",
        alternate: "9833445567",
        grade: "7",
        source: "Website",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Direct online application for Grade 7. Ready for CBT.",
        history: [{ actor: "Web admissions portal", at: new Date(), text: "Online registration confirmed." }],
      },
      {
        leadId: "AC-2027-009",
        school: "Acadza Greenfield School",
        student: "Ishaan Gupta",
        parent: "Rajesh Gupta",
        phone: "9855667788",
        alternate: "9855667789",
        grade: "9",
        source: "Walk-in",
        cycle: "2027/28",
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Secondary school intake for Grade 9. Ready for Grade 8 syllabus evaluation.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Walk-in intake for Class 9." }],
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
        due: new Date(),
        lastOutcome: "Opted straight for Grade 10 board prep evaluation.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Direct entrance test slot." }],
      },
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
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Inquired for 2-year JEE coaching + schooling. Routed to CBT.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Routed to CBT evaluation." }],
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
        stage: "READY_FOR_CBT",
        caller: null,
        nextAction: "Schedule entrance test (CBT)",
        due: new Date(),
        lastOutcome: "Interested in Physics and Maths revision batch. Ready for CBT diagnostic.",
        history: [{ actor: "Front desk clerk", at: new Date(), text: "Routed to entrance diagnostic test." }],
      },
    ];

    await Lead.insertMany(seedData);
    return res.json({ isSuccessful: true, message: "Database seeded successfully" });
  } catch (err) {
    return res.status(500).json({ isSuccessful: false, message: err.message });
  }
};

/**
 * GET /admin/leads/cbt/test-paper/:studentId
 * Public endpoint: Candidate retrieves their allocated entrance test paper.
 */
exports.get_cbt_test_paper = async (req, res) => {
  try {
    const { studentId } = req.params;
    let lead = null;
    if (studentId && studentId !== "GUEST") {
      lead = await Lead.findOne({
        $or: [{ leadId: studentId }, { _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }],
      });
    }

    if (lead && lead.testPaper) {
      return res.json({
        isSuccessful: true,
        testPaper: lead.testPaper,
        candidate: { student: lead.student, parent: lead.parent, grade: lead.grade, id: lead.leadId },
      });
    }

    return res.json({
      isSuccessful: true,
      testPaper: null,
      candidate: lead ? { student: lead.student, parent: lead.parent, grade: lead.grade, id: lead.leadId } : null,
    });
  } catch (err) {
    return res.status(500).json({ isSuccessful: false, error: err.message });
  }
};

/**
 * POST /admin/leads/cbt/submit-test
 * Public endpoint: Candidate submits their completed CBT test.
 * Scores, grading, and result summary are persisted to MongoDB Atlas.
 */
exports.submit_cbt_test = async (req, res) => {
  try {
    const { studentId, testId, clientResult } = req.body;
    let lead = null;
    if (studentId && studentId !== "GUEST") {
      lead = await Lead.findOne({
        $or: [{ leadId: studentId }, { _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }],
      });
    }

    if (!lead) {
      return res.json({ isSuccessful: true, message: "Guest test recorded", result: clientResult });
    }

    const totalScore = clientResult?.score || 0;
    const totalMarks = clientResult?.totalMarks || 30;
    const percentage = clientResult?.percentage || 0;

    lead.stage = "CBT_COMPLETED";
    lead.lastOutcome = `CBT Test Submitted. Score: ${totalScore}/${totalMarks} (${percentage}%)`;
    lead.nextAction = "Review Entrance CBT Score & Issue Merit Rank";
    lead.testResult = clientResult;

    lead.history.push({
      actor: "Student CBT Portal",
      at: new Date(),
      text: `CBT Entrance Assessment submitted by candidate. Score: ${totalScore}/${totalMarks} (${percentage}%). Status updated to CBT_COMPLETED.`,
    });

    await lead.save();

    return res.json({
      isSuccessful: true,
      message: "CBT Result recorded successfully in Atlas",
      lead: formatLead(lead),
    });
  } catch (err) {
    console.error("Error submitting CBT test:", err);
    return res.status(500).json({ isSuccessful: false, error: err.message });
  }
};

