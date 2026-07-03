const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const driverDistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // 字典ID
    name: { type: String, required: true }, // 字典名称
    ...baseModel,
  },
  {
    id: false,
  }
);

module.exports = driverDistSchema;
