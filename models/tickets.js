const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true, min: 3 },
  title: { type: String, required: true, min: 3 },
  ticketPrice: { type: Number, required: true},
  from: { type: String, required: true},
  to: { type: String, required: true}, 
  toPhotoUrl: {type: String, required: true},
});

module.exports = mongoose.model("Tickets", ticketSchema);