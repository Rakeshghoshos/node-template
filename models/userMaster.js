let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String, default: "" },
    mobile: { type: String, default: "" },
    emailId: { type: String, required: true },
    password: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  { timestamps: true, strict: false }
);
schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);
const user = mongoose.model("user", schema);

module.exports = user;
