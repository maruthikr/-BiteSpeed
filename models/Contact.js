const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  phoneNumber: String,
  email: String,
  linkedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  linkPrecedence: { type: String, enum: ["primary", "secondary"], default: "primary" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Contact", contactSchema);
