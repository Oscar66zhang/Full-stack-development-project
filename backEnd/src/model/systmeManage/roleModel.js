const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const roleSchema = new mongoose.Schema({
  roleName: { type: String, require: true },
  remark: { type: String },
  permissionList: {
    checkedKeys: { type: Array, default: [] },
    halfCheckedKeys: { type: Array, default: [] },
  },
  ...baseModel,
});

module.exports = roleSchema;
