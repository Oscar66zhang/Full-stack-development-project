const mongoose = require("mongoose");
const { DriverList } = require("../../model");

//获取司机列表
exports.getDriverList = async (ctx) => {
  const pageNum = Number(ctx.query.pageNum || 1);
  const pageSize = Number(ctx.query.pageSize || 10);
  const total = await DriverList.countDocuments();
  const list = await DriverList.find()
    .sort({ createTime: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    code: 200,
    data: {
      list,
      page: {
        total,
        pageNum,
        pageSize,
      },
    },
  };
};

//司机创建
exports.createDriver = async (ctx) => {
  const {
    driverName,
    driverId,
    driverPhone,
    cityName,
    grade = false,
    driverLevel,
    accountStatus,
    carNo,
    vehicleBrand,
    vehicleName,
    onlineTime = 0,
    driverAmount = 0,
    rating = 0,
    driverScore = 0,
    pushOrderCount = 0,
    orderCompleteCount = 0,
  } = ctx.request.body;

  if (
    !driverName ||
    !driverId ||
    !driverPhone ||
    !cityName ||
    driverLevel === undefined ||
    accountStatus === undefined ||
    !carNo ||
    !vehicleBrand ||
    !vehicleName
  ) {
    ctx.body = {
      code: 400,
      message: "缺少必要参数",
    };
    return;
  }

  if (![0, 1, 2, 3, 4].includes(Number(accountStatus))) {
    ctx.body = {
      code: 400,
      message: "司机状态不合法",
    };
    return;
  }

  const existDriver = await DriverList.findOne({ driverId });

  if (existDriver) {
    ctx.body = {
      code: 400,
      message: "司机ID已存在",
    };
    return;
  }

  const driver = await DriverList.create({
    driverName,
    driverId,
    driverPhone,
    cityName,
    grade,
    driverLevel,
    accountStatus,
    carNo,
    vehicleBrand,
    vehicleName,
    onlineTime,
    driverAmount,
    rating,
    driverScore,
    pushOrderCount,
    orderCompleteCount,
  });

  ctx.body = {
    code: 200,
    message: "创建成功",
    data: driver,
  };
};

//编辑司机
exports.updateDriver = async (ctx) => {
  const { driverId } = ctx.params;
  const {
    driverName,
    driverPhone,
    cityName,
    grade,
    driverLevel,
    accountStatus,
    carNo,
    vehicleBrand,
    vehicleName,
    onlineTime,
    driverAmount,
    rating,
    driverScore,
    pushOrderCount,
    orderCompleteCount,
  } = ctx.request.body;

  if (!driverId) {
    ctx.body = { code: 400, message: "缺少司机ID" };
    return;
  }

  const driver = await DriverList.findOneAndUpdate(
    { driverId: Number(driverId) },
    {
      driverName,
      driverPhone,
      cityName,
      grade,
      driverLevel,
      accountStatus,
      carNo,
      vehicleBrand,
      vehicleName,
      onlineTime,
      driverAmount,
      rating,
      driverScore,
      pushOrderCount,
      orderCompleteCount,
    },
    { new: true },
  );

  if (!driver) {
    ctx.body = { code: 404, message: "司机不存在" };
    return;
  }

  ctx.body = { code: 200, message: "更新成功", data: driver };
};

//删除司机
exports.deleteDriver = async (ctx) => {
  const { driverId } = ctx.params;
  if (!driverId) {
    ctx.body = { code: 400, message: "缺少司机ID" };
    return;
  }
  const result = await DriverList.deleteOne({ driverId });
  if (result.deletedCount === 0) {
    ctx.body = { code: 404, message: "司机不存在或已删除" };
    return;
  }
  ctx.body = { code: 200, message: "删除成功" };
};

// 搜索司机列表（支持按名称和状态筛选）
exports.searchDriver = async (ctx) => {
  const { driverName, accountStatus } = ctx.query;
  const pageNum = Number(ctx.query.pageNum || 1);
  const pageSize = Number(ctx.query.pageSize || 10);
  const filter = {};
  if (driverName) filter.driverName = new RegExp(driverName, "i");
  if (accountStatus !== undefined) filter.accountStatus = Number(accountStatus);

  const total = await DriverList.countDocuments(filter);
  const list = await DriverList.find(filter)
    .sort({ createTime: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    code: 200,
    data: { list, page: { total, pageNum, pageSize } },
  };
};
