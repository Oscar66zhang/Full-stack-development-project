const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const deptSchema = new mongoose.Schema({
  deptName: { type: String, required: true },
  parentId: { type: String, default: "" },
  userName: { type: String, required: true },
  ...baseModel,
});

module.exports = deptSchema;
