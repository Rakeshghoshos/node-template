let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    marketId: { type: Number, requred: true },
    TMOOnly: { type: Number, required: true }, //in percent
    SPROnly: { type: Number, required: true }, //in percent,
    NTM: { type: Number, required: true }, //in percent
    extraDetails: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
module.exports = schema;
