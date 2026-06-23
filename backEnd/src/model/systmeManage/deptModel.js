const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const deptSchema = new mongoose.Schema({
  deptName: { type: String, required: true }, // 部门名称
  parentId: { type: String, default: "0" }, // 父级ID，0为根节点
  userName: { type: String }, // 负责人姓名
  children: { type: Array, default: [] }, // 子部门（树形结构）
});

deptSchema.plugin(baseModel);

module.exports = deptSchema;
