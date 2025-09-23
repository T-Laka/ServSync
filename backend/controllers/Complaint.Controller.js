import Complaint from "../models/Complaint.model.js";
import Customer from "../models/Customer.model.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { name, email, phone, branch, category, description } = req.body;
    if (!description) return res.status(400).json({ error: "Description is required" });

    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({ name, email, phone, branch });
    }

    const complaint = await Complaint.create({
      customer: customer._id,
      category,
      description,
      branch,
      logs: [{ actor: "system", action: "created" }]
    });

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get complaint by Mongo _id
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('customer');
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update complaint status and response
export const updateComplaintStatus = async (req, res) => {
  try {
    let { status, responseNotes } = req.body;
    const allowedStatuses = ["pending", "in-progress", "resolved", "escalated"];
    if (typeof status === 'string') {
      status = status.trim().toLowerCase().replace(/\s+/g, '-');
    }
    if (status && !allowedStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (status) complaint.status = status;
    if (responseNotes) complaint.responseNotes = responseNotes;
    complaint.updatedAt = new Date();

    const actor = req.user?.email || 'admin';
    complaint.logs.push({ actor, action: "updated", note: responseNotes });

    await complaint.save();
    res.json({ success: true, complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const { email } = req.query || {};
    if (email) {
      const customer = await Customer.findOne({ email });
      if (!customer) return res.json([]);
      const complaints = await Complaint.find({ customer: customer._id }).populate('customer').sort({ createdAt: -1 });
      return res.json(complaints);
    }

    const complaints = await Complaint.find().populate('customer').sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get complaint by referenceId
export const getComplaintByReferenceId = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const complaint = await Complaint.findOne({ referenceId }).populate('customer');
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Public update
export const updateComplaintPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, category, description } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const complaint = await Complaint.findById(id).populate('customer');
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    if (!complaint.customer || complaint.customer.email !== email) {
      return res.status(403).json({ error: "Not allowed to edit this complaint" });
    }

    if (category?.trim()) complaint.category = category.trim();
    if (description?.trim()) complaint.description = description.trim();

    complaint.updatedAt = new Date();
    complaint.logs.push({ actor: email, action: "user-updated" });

    await complaint.save();
    res.json({ success: true, complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Public delete
export const deleteComplaintPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.body?.email || req.query?.email;

    const complaint = await Complaint.findById(id).populate('customer');
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    if (email && (!complaint.customer || complaint.customer.email !== email)) {
      return res.status(403).json({ error: "Not allowed to delete this complaint" });
    }

    await Complaint.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
