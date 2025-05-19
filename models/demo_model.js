let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String },
    isDeleted: { type: Boolean },
    isActive: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    businessCategoryId: { type: Schema.Types.ObjectId, default: null },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre("insertMany", async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  delete object.createdAt;
  delete object.updatedAt;
  delete object.__v;
  return object;
});

schema.plugin(mongoosePaginate);
module.exports = schema;
