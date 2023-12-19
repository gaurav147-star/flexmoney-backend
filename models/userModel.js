const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String }, // Add gender field
    age: { type: Number }, // Add age field
    currentBatch: { type: String }, // Add currentBatch field
    startDates: { type: Date }, // Add currentDates as an array of dates
    batchOfUpdates: { type: [{ batch: String, date: Date }] }, // Add batchOfUpdates as an array of objects with batch and date fields
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
