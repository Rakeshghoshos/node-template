let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const spectrumSpeedSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: true,
    enum: [
      "LTE TDD",
      "LTE TDD Scell",
      "NR TDD",
      "LTE FDD",
      "LTE FDD Scell",
      "NR FDD",
      "LAA",
    ],
  },
  band: {
    type: String,
    required: true,
  },
  systemType: {
    type: String,
    required: true,
    enum: ["SISO", "2x2 MIMO", "4x4 MIMO", "mmW"],
  },
  bandwidth: {
    type: String,
    required: true,
  },
  dlSpeed: {
    type: Number,
    required: true,
    min: 0,
  },
  ulSpeed: {
    type: Number,
    required: true,
    min: 0,
  },
  carriersAvailable: {
    type: [String],
    default: [],
  },
  extraDetails: { type: Schema.Types.Mixed, default: {} },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SpectrumSpeed = mongoose.model("SpectrumSpeed", spectrumSpeedSchema);

module.exports = SpectrumSpeed;
