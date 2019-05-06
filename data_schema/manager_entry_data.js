const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Data structure of entry in study manager app.
const ManagerEntryDataSchema = new Schema(
  {
    content: String,
    location: String,
    completed: Boolean,
    tags: []
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("ManagerEntryData", ManagerEntryDataSchema);
