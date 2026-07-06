const mongoose = require("mongoose");
const XLSX = require("xlsx");
const { OrderList } = require("../../model");
const { amapWebServiceKey } = require("../../config/config.default");

// 城市中心点坐标映射表
// 格式：[经度, 纬度]
const cityCenterMap = {
  北京: [116.397428, 39.90923],
  上海: [121.473667, 31.230525],
  广州: [113.264385, 23.129112],
  深圳: [114.057868, 22.543099],
};

/**
 * 生成 min 到 max 之间的随机数
 * 例如 randomBetween(1, 5) 会生成 1 ~ 5 之间的小数
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 根据三阶贝塞尔曲线公式，计算某一个 t 时刻的坐标点
 *
 * t: 曲线进度，范围 0 ~ 1
 * start: 起点坐标
 * control1: 第一个控制点
 * control2: 第二个控制点
 * end: 终点坐标
 *
 * t = 0 时，返回起点
 * t = 1 时，返回终点
 * t 越接近 1，点越靠近终点
 */
function getBezierPoint(t, start, control1, control2, end) {
  // 计算当前 t 对应的经度
  const x =
    Math.pow(1 - t, 3) * start[0] +
    3 * Math.pow(1 - t, 2) * t * control1[0] +
    3 * (1 - t) * Math.pow(t, 2) * control2[0] +
    Math.pow(t, 3) * end[0];

  // 计算当前 t 对应的纬度
  const y =
    Math.pow(1 - t, 3) * start[1] +
    3 * Math.pow(1 - t, 2) * t * control1[1] +
    3 * (1 - t) * Math.pow(t, 2) * control2[1] +
    Math.pow(t, 3) * end[1];

  // 返回一个坐标点：[经度, 纬度]
  return [x, y];
}

/**
 * 根据城市名称生成一条模拟订单轨迹
 *
 * cityName: 城市名称，例如 北京 / 上海 / 广州 / 深圳
 *
 * 返回值：
 * [
 *   { lng: '116.123456', lat: '39.123456' },
 *   ...
 * ]
 */
function createMockRoute(cityName) {
  // 根据城市名称获取城市中心点
  // 如果传入的城市不存在，默认使用北京
  const center = cityCenterMap[cityName] || cityCenterMap["北京"];

  // 解构出中心点经纬度
  const [lng, lat] = center;

  // 生成轨迹起点
  // 在城市中心点左侧附近随机偏移一点
  const start = [
    lng + randomBetween(-0.04, -0.015),
    lat + randomBetween(-0.025, 0.01),
  ];

  // 生成轨迹终点
  // 在城市中心点右侧附近随机偏移一点
  const end = [
    lng + randomBetween(0.015, 0.045),
    lat + randomBetween(-0.01, 0.03),
  ];

  // 第一个控制点
  // 用来控制曲线前半段的弯曲方向
  const control1 = [
    lng + randomBetween(-0.035, 0.015),
    lat + randomBetween(0.02, 0.045),
  ];

  // 第二个控制点
  // 用来控制曲线后半段的弯曲方向
  const control2 = [
    lng + randomBetween(0.005, 0.04),
    lat + randomBetween(-0.045, -0.015),
  ];

  // 生成 16 个轨迹点
  // index 从 0 到 15
  return Array.from({ length: 16 }, (_, index) => {
    // t 表示当前点在整条曲线上的进度
    // 第一个点 t = 0，最后一个点 t = 1
    const t = index / 15;

    // 根据贝塞尔曲线计算当前轨迹点坐标
    const [pointLng, pointLat] = getBezierPoint(
      t,
      start,
      control1,
      control2,
      end,
    );

    // 给中间轨迹点增加一点随机抖动，让路线看起来更自然
    // 起点和终点不加抖动，保证固定
    const jitterLng =
      index === 0 || index === 15 ? 0 : randomBetween(-0.0015, 0.0015);

    const jitterLat =
      index === 0 || index === 15 ? 0 : randomBetween(-0.0012, 0.0012);

    // 返回当前轨迹点
    // toFixed(6)：保留 6 位小数
    // String()：转成字符串，方便和后端 mock 数据格式保持一致
    return {
      lng: String((pointLng + jitterLng).toFixed(6)),
      lat: String((pointLat + jitterLat).toFixed(6)),
    };
  });
}

function getAmapKey() {
  return process.env.AMAP_WEB_SERVICE_KEY || amapWebServiceKey;
}

async function geocodeAddress(address, cityName) {
  const key = getAmapKey();

  if (!key) {
    throw new Error("缺少 AMAP_WEB_SERVICE_KEY，请先配置高德 Web服务 Key");
  }

  if (!address) {
    throw new Error("地址不能为空");
  }

  const url = new URL("https://restapi.amap.com/v3/geocode/geo");
  url.searchParams.set("key", key);
  url.searchParams.set("address", address);
  url.searchParams.set("output", "JSON");

  if (cityName) {
    url.searchParams.set("city", cityName);
  }

  const response = await fetch(url);
  const data = await response.json();
  const location = data?.geocodes?.[0]?.location;

  console.log("高德地理编码结果:", {
    address,
    cityName,
    status: data?.status,
    info: data?.info,
    infocode: data?.infocode,
    location,
  });

  if (data?.status !== "1") {
    throw new Error(
      `${address} 地址解析失败：${data?.info || "未知错误"}${
        data?.infocode ? `(${data.infocode})` : ""
      }`,
    );
  }

  if (!location) {
    throw new Error(`${address} 地址解析失败：未返回经纬度`);
  }

  return location;
}

function parsePolyline(polyline) {
  if (!polyline) {
    return [];
  }

  return polyline
    .split(";")
    .map((point) => {
      const [lng, lat] = point.split(",");

      if (!lng || !lat) {
        return null;
      }

      return { lng, lat };
    })
    .filter(Boolean);
}

async function createAmapDrivingRoute({ cityName, startAddress, endAddress }) {
  const key = getAmapKey();

  if (!key) {
    throw new Error("缺少 AMAP_WEB_SERVICE_KEY，请先配置高德 Web服务 Key");
  }

  if (!startAddress || !endAddress) {
    return [];
  }

  const origin = await geocodeAddress(startAddress, cityName);
  const destination = await geocodeAddress(endAddress, cityName);

  const url = new URL("https://restapi.amap.com/v3/direction/driving");
  url.searchParams.set("key", key);
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("extensions", "base");
  url.searchParams.set("output", "JSON");

  const response = await fetch(url);
  const data = await response.json();

  if (data?.status !== "1") {
    throw new Error(
      `路线规划失败：${data?.info || "未知错误"}${
        data?.infocode ? `(${data.infocode})` : ""
      }`,
    );
  }

  const steps = data?.route?.paths?.[0]?.steps || [];
  const route = steps.flatMap((step) => parsePolyline(step.polyline));

  const result = route.filter((point, index, list) => {
    const prev = list[index - 1];
    return !prev || prev.lng !== point.lng || prev.lat !== point.lat;
  });

  console.log("高德驾车路线结果:", {
    cityName,
    startAddress,
    endAddress,
    origin,
    destination,
    status: data?.status,
    info: data?.info,
    infocode: data?.infocode,
    distance: data?.route?.paths?.[0]?.distance,
    duration: data?.route?.paths?.[0]?.duration,
    stepCount: steps.length,
    routePointCount: result.length,
  });

  if (result.length < 2) {
    throw new Error("路线规划成功，但返回轨迹点不足");
  }

  return result;
}

async function buildOrderRoute(params) {
  if (Array.isArray(params.route) && params.route.length) {
    return params.route;
  }

  const startAddress =
    params.startAddress && String(params.startAddress).trim();
  const endAddress = params.endAddress && String(params.endAddress).trim();

  if (!startAddress || !endAddress) {
    return [];
  }

  return await createAmapDrivingRoute({
    cityName: params.cityName,
    startAddress,
    endAddress,
  });
}

// 获取订单列表
exports.getOrderList = async (ctx) => {
  const pageNum = Number(ctx.query.pageNum || 1);
  const pageSize = Number(ctx.query.pageSize || 10);

  const total = await OrderList.countDocuments();

  const list = await OrderList.find()
    .sort({ createTime: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    code: 200,
    data: {
      list,
      total,
      pageNum,
      pageSize,
    },
  };
};

// 获取订单详情
exports.getOrderDetail = async (ctx) => {
  const { orderId } = ctx.params;
  if (!orderId) {
    ctx.body = { code: 400, message: "订单ID不能为空" };
    return;
  }

  // 支持传入 _id 或 orderId 两种方式查询
  const query = mongoose.Types.ObjectId.isValid(orderId)
    ? {
        $or: [{ _id: orderId }, { orderId }],
      }
    : {
        orderId,
      };

  const order = await OrderList.findOne(query);
  if (!order) {
    ctx.body = { code: 404, message: "订单不存在" };
    return;
  }
  ctx.body = { code: 200, data: order };
};

// 创建订单
exports.createOrderList = async (ctx) => {
  const params = ctx.request.body;

  const requiredFields = [
    "cityName",
    "userName",
    "driverName",
    "vehicleName",
    "driverAmount",
  ];

  for (const key of requiredFields) {
    if (params[key] === undefined || params[key] === "") {
      ctx.body = {
        code: 400,
        message: `${key} 不能为空`,
      };
      return;
    }
  }

  const amountFields = ["orderAmount", "userPayAmount", "driverAmount"];

  for (const key of amountFields) {
    if (params[key] !== undefined && params[key] !== "") {
      const value = Number(params[key]);
      if (Number.isNaN(value)) {
        ctx.body = {
          code: 400,
          message: `${key} 必须是数字`,
        };
        return;
      }
      if (value < 0) {
        ctx.body = {
          code: 400,
          message: `${key} 不能小于0`,
        };
        return;
      }
    }
  }

  if (params.mobile && !/^1[3-9]\d{9}$/.test(params.mobile)) {
    ctx.body = {
      code: 400,
      message: "手机号格式不正确",
    };
    return;
  }

  const route =
    Array.isArray(params.route) && params.route.length ? params.route : [];

  const order = new OrderList({
    ...params,
    route,
    remark: params.remark || "",
  });

  await order.save();

  ctx.body = {
    code: 200,
    message: "创建成功",
    data: {
      _id: order._id,
      orderId: order.orderId,
    },
  };
};

//删除订单
exports.deleteOrderList = async (ctx) => {
  const { _id } = ctx.params;
  if (!_id) {
    ctx.body = {
      code: 400,
      message: "订单ID不能为空",
    };
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    ctx.body = {
      code: 400,
      message: "订单ID格式不正确",
    };
    return;
  }

  const order = await OrderList.findByIdAndDelete(_id);

  if (!order) {
    ctx.body = {
      code: 404,
      message: "订单不存在",
    };
    return;
  }

  ctx.body = {
    code: 200,
    message: "删除成功",
  };
};

// 更新订单打点
exports.updateOrderRoute = async (ctx) => {
  const { _id, orderId, route } = ctx.request.body;

  if (!_id && !orderId) {
    ctx.body = {
      code: 400,
      message: "订单ID不能为空",
    };
    return;
  }

  if (!Array.isArray(route)) {
    ctx.body = {
      code: 400,
      message: "打点数据格式不正确",
    };
    return;
  }

  const nextRoute = [];

  for (const item of route) {
    const lng = String(item.lng || "").trim();
    const lat = String(item.lat || "").trim();

    if (
      !lng ||
      !lat ||
      Number.isNaN(Number(lng)) ||
      Number.isNaN(Number(lat))
    ) {
      ctx.body = {
        code: 400,
        message: "打点经纬度格式不正确",
      };
      return;
    }

    nextRoute.push({ lng, lat });
  }

  const query = _id
    ? { _id }
    : {
        orderId,
      };

  const order = await OrderList.findOneAndUpdate(
    query,
    {
      route: nextRoute,
      updateAt: Date.now(),
    },
    { new: true },
  );

  if (!order) {
    ctx.body = {
      code: 404,
      message: "订单不存在",
    };
    return;
  }

  ctx.body = {
    code: 200,
    message: "打点保存成功",
    data: order,
  };
};

// 查询订单
exports.searchOrderList = async (ctx) => {
  const { orderId, userName, state } = ctx.query;
  const pageNum = Number(ctx.query.pageNum || 1);
  const pageSize = Number(ctx.query.pageSize || 10);
  const query = {};

  if (orderId) {
    const keyword = String(orderId).trim();
    query.$or = [{ orderId: keyword }];

    if (mongoose.Types.ObjectId.isValid(keyword)) {
      query.$or.push({ _id: keyword });
    }
  }

  if (userName) {
    query.userName = new RegExp(userName, "i");
  }

  if (state !== undefined && state !== "") {
    const stateValue = Number(state);

    if (Number.isNaN(stateValue)) {
      ctx.body = {
        code: 400,
        message: "订单状态格式不正确",
      };
      return;
    }

    query.state = stateValue;
  }

  const total = await OrderList.countDocuments(query);

  const list = await OrderList.find(query)
    .sort({ createTime: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    code: 200,
    data: {
      list,
      total,
      pageNum,
      pageSize,
    },
  };
};

// 导出订单
exports.exportOrderList = async (ctx) => {
  const list = await OrderList.find().sort({ createTime: -1 });
  // 转成 sheet 数据
  const data = list.map((item) => ({
    订单ID: item.orderId || item._id.toString(),
    城市: item.cityName,
    用户名称: item.userName,
    手机号: item.mobile,
    开始地址: item.startAddress,
    结束地址: item.endAddress,
    订单金额: item.orderAmount,
    支付金额: item.userPayAmount,
    司机金额: item.driverAmount,
    支付方式: item.payType === 1 ? "微信" : item.payType === 2 ? "支付宝" : "",
    司机名称: item.driverName,
    车型: item.vehicleName,
    订单状态:
      {
        1: "进行中",
        2: "已完成",
        3: "超时",
        4: "取消",
      }[item.state] || "",
    用车时间: item.useTime,
    结束时间: item.endTime,
    轨迹点数: item.route?.length || 0,
    创建时间: item.createTime
      ? new Date(item.createTime).toLocaleString("zh-CN", { hour12: false })
      : "",
    备注: item.remark,
  }));

  // 将普通数组 data 转换成 Excel 的工作表
  const ws = XLSX.utils.json_to_sheet(data);
  // 创建一个新的 Excel 工作簿，相当于创建一个空的 Excel 文件
  const wb = XLSX.utils.book_new();
  // 将工作表 ws 添加到工作簿 wb 中
  // 第三个参数 "订单列表" 是 Excel 底部 sheet 页签的名称
  XLSX.utils.book_append_sheet(wb, ws, "订单列表");
  // 将 Excel 工作簿转换成 buffer 二进制数据
  // 因为后端返回给前端下载时，需要返回文件流/二进制数据
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  // 设置响应头，告诉浏览器当前返回的是 Excel 文件
  ctx.set(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent("订单列表.xlsx")}`,
  );
  // 设置响应头，告诉浏览器以附件形式下载文件
  // filename 指定下载后的文件名
  ctx.set("Content-Disposition", "attachment; filename=order_list.xlsx");
  // 将生成好的 Excel 文件返回给前端
  ctx.body = buf;
};
