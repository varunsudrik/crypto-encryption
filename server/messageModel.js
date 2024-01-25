const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  algorithm: { type: String, required: true },
  text: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
