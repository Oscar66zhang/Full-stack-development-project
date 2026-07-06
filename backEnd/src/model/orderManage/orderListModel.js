const mongoose = require("mongoose");
const baseModel = require("../baseModel");

const routeSchema = new mongoose.Schema(
  {
    lng: { type: String, required: true },
    lat: { type: String, required: true },
  },
  { _id: false },
);

const orderListSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  cityName: { type: String, required: true }, // 城市名称
  userName: { type: String, required: true }, // 用户名称
  mobile: { type: Number, default: "" }, // 用户手机号
  startAddress: { type: String, default: "" }, // 下单开始地址
  endAddress: { type: String, default: "" }, // 下单结束地址
  orderAmount: { type: Number, default: 0 }, // 订单金额
  userPayAmount: { type: Number, default: 0 }, // 支付金额
  driverAmount: { type: Number, required: true }, // 司机金额
  payType: { type: Number, enum: [1, 2], default: 1 }, // 1: 微信 2: 支付宝
  driverName: { type: String, required: true }, // 司机名称
  vehicleName: { type: String, required: true }, // 订单车型
  state: { type: Number, enum: [1, 2, 3, 4], default: 1 }, // 1: 进行中 2: 已完成 3: 超时 4: 取消
  useTime: { type: String, default: "" }, // 用车时间
  endTime: { type: String, default: "" }, // 订单结束时间
  route: { type: [routeSchema], default: [] }, // 行驶轨迹
  createTime: { type: Date, default: Date.now }, // 创建时间
  remark: { type: String, default: "" }, // 备注
  ...baseModel,
});

orderListSchema.pre("validate", function () {
  if (!this.orderId) {
    this.orderId = this._id.toString();
  }
});

module.exports = orderListSchema;
