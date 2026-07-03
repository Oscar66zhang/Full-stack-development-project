const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const driverListSchema = new mongoose.Schema({
  driverName: { type: String, required: true }, // 司机名称
  driverId: { type: Number, required: true, unique: true }, // 司机ID
  driverPhone: { type: String, required: true }, // 司机手机号
  cityName: { type: String, required: true }, // 城市名称
  grade: { type: Boolean, default: false }, // 会员等级
  driverLevel: { type: Number, required: true }, // 司机等级
  accountStatus: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4], // 0: 待认证 1: 正常 2: 暂时拉黑 3: 永久拉黑 4: 停止推送
  },
  carNo: { type: String, required: true }, // 车牌号
  vehicleBrand: { type: String, required: true }, // 车辆品牌
  vehicleName: { type: String, required: true }, // 车辆名称
  onlineTime: { type: Number, default: 0 }, // 昨日在线时长
  driverAmount: { type: Number, default: 0 }, // 昨日司机流水
  rating: { type: Number, default: 0 }, // 司机评分
  driverScore: { type: Number, default: 0 }, // 司机行为分
  pushOrderCount: { type: Number, default: 0 }, // 昨日推单数
  orderCompleteCount: { type: Number, default: 0 }, // 昨日完单数
  createTime: { type: Date, default: Date.now }, // 创建时间
  ...baseModel,
});

module.exports = driverListSchema;
