exports.getReport = async (ctx) => {
  // 顶部卡片数据
  const reportData = {
    driverCount: 128,
    totalMoney: 358620,
    orderCount: 2356,
    cityNum: 12,
  };
  const lineDate = {
    label: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    order: [120, 200, 150, 300, 250, 180, 220],
    money: [1200, 2000, 1500, 3000, 2500, 1800, 2200],
  };
  // 饼图数据
  const pieData = [
    { value: 1048, name: "北京" },
    { value: 735, name: "上海" },
    { value: 580, name: "广州" },
    { value: 484, name: "深圳" },
    { value: 300, name: "成都" },
  ];

  // 雷达图数据
  const radarData = {
    indicator: [
      { name: "销售额", max: 50000 },
      { name: "订单量", max: 1000 },
      { name: "用户数", max: 500 },
      { name: "好评率", max: 100 },
      { name: "完成率", max: 100 },
    ],
    data: {
      name: "本周数据",
      value: [35000, 800, 300, 85, 92],
    },
  };
  ctx.body = {
    code: 200,
    message: "success",
    data: {
      reportData,
      lineDate,
      pieData,
      radarData,
    },
  };
};
