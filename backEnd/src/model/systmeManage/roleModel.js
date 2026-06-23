const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const roleSchema = new mongoose.Schema({
  roleName: { type: String, require: true }, //角色名
  remark: { type: String }, //备注
  ...baseModel,
});

module.exports = roleSchema;
