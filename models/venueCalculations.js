let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    type: Schema.Types.Mixed,
    required: true,
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
const venueCalculations = mongoose.model("venueCalculations", schema);

module.exports = venueCalculations;
