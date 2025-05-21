let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: string, required: true },
    dlLTESpeed: { type: Number, required: true }, //in kbps
    ulLTESpeed: { type: Number, required: true }, //in kbps
    dlNRSpeed: { type: Number, required: true }, //in kbps
    upNRSpeed: { type: Number, required: true }, //in kbps
    dlFR2NRSpeed: { type: Number, required: true }, //in kbps
    dlActivityFactor: { type: Number, required: true }, //in percent
    ulActivityFactor: { type: Number, required: true }, //in percent
    dlIncrease: { type: Number, required: true }, //in percent change YOY
    ulIncrease: { type: Number, required: true }, //in percent change YOY
    extraDetails: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
module.exports = schema;
