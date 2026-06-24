const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const menuSchema = new mongoose.Schema({
  menuName: { type: String, required: true },
  icon: { type: String },
  menuType: { type: Number, required: true },
  menuState: { type: Number, default: 1 },
  menuCode: { type: String },
  parentId: { type: String, default: "" },
  path: { type: String },
  component: { type: String },
  ...baseModel,
});

module.exports = menuSchema;
