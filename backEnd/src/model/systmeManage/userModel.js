const mongoose = require("mongoose");
const md5 = require("../../util/md5");

const baseModel = require("../baseModel");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true }, // 用户名
  userEmail: { type: String, required: true }, // 邮箱
  userImg: { type: String }, // 头像（可选）
  role: { type: Number, required: false }, // 角色：0=超级管理员 1=管理员 2=普通用户
  roleList: { type: String, required: false }, // 角色列表（多个角色用逗号分隔）
  deptId: { type: String, required: false }, // 部门ID
  deptName: { type: String, required: true }, // 部门名称
  createId: { type: Number, required: false }, // 创建者ID
  state: { type: Number, required: false }, // 状态：0=禁用 1=启用
  ...baseModel,
});

module.exports = userSchema;
