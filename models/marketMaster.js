let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    marketId: { type: String, requred: true },
    marketName: { type: String, requred: true },
    extraDetails: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
module.exports = schema;
