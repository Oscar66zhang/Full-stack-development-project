const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const deptSchema = new mongoose.Schema({
  _id: { type: String, required: false },
  deptName: { type: String, required: true },
  parentId: { type: String, default: "" },
  userName: { type: String, required: true },
  ...baseModel,
});

module.exports = deptSchema;
