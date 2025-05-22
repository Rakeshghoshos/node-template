let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { required } = require("joi");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    venueInformation: {
      type: Schema.Types.Mixed,
      required: true,
    },
    lteSpectrum: {
      type: Schema.Types.Mixed,
      required: true,
    },
    nrSpectrum: {
      type: Schema.Types.Mixed,
      required: true,
    },
    optional: {
      type: Schema.Types.Mixed,
      required: true,
    },
    results: {
      type: Schema.Types.Mixed,
      required: true,
    },
    extraDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
const venueCapacity = mongoose.model("venueCapacity", schema);

module.exports = venueCapacity;
