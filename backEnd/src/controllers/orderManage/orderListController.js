const { OrderList } = require("../../model");

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

  const order = new OrderList({
    ...params,
    route: params.route || [],
    remark: params.remark || "",
  });
  await order.save();

  ctx.body = {
    code: 200,
    message: "创建成功",
    data: { _id: order._id },
  };
};

//查询订单
exports.searchOrderList = async (ctx) => {
  const { orderId, userName, state } = ctx.query;
  const pageNum = Number(ctx.query.pageNum || 1);
  const pageSize = Number(ctx.query.pageSize || 10);
  const query = {};

  //订单ID，对应MongoDB的_id
  if (orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      ctx.body = {
        code: 400,
        message: "订单ID格式不正确",
      };
      return;
    }

    query._id = orderId;
  }
  // 用户名称，模糊查询
  if (userName) {
    query.userName = new RegExp(userName, "i");
  }

  // 订单状态
  if (state) {
    query.state = Number(state);
  }

  const total = await OrderList.countDocuments(query);

  const list = await OrderList.find(query)
    .sort({ createTime: 1 })
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
    订单ID: item._id,
    城市: item.cityName,
    用户名称: item.userName,
    手机号: item.mobile,
    开始地址: item.startAddress,
    结束地址: item.endAddress,
    订单金额: item.orderAmount,
    支付金额: item.userPayAmount,
    司机金额: item.driverAmount,
    支付方式: item.payType === 1 ? "微信" : "支付宝",
    司机名称: item.driverName,
    车型: item.vehicleName,
    订单状态: ["", "进行中", "已完成", "超时", "取消"][item.state],
    用车时间: item.useTime,
    结束时间: item.endTime,
    轨迹点数: item.route?.length || 0,
    创建时间: item.createTime,
    备注: item.remark,
  }));

  // 将普通数组 data 转换成 Excel 的工作表
  const ws = XLSX.utils.json_sheet(data);
  // 创建一个新的 Excel 工作簿，相当于创建一个空的 Excel 文件
  const wb = XLSX.utils.book_new();
  // 将工作表 ws 添加到工作簿 wb 中
  // 第三个参数 "订单列表" 是 Excel 底部 sheet 页签的名称
  XLSX.utils.book_append.sheet(wb, ws, "订单列表");
  // 将 Excel 工作簿转换成 buffer 二进制数据
  // 因为后端返回给前端下载时，需要返回文件流/二进制数据
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  // 设置响应头，告诉浏览器当前返回的是 Excel 文件
  ctx.set(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  // 设置响应头，告诉浏览器以附件形式下载文件
  // filename 指定下载后的文件名
  ctx.set("Content-Disposition", "attachment; filename=order_list.xlsx");
  // 将生成好的 Excel 文件返回给前端
  ctx.body = buf;
};
