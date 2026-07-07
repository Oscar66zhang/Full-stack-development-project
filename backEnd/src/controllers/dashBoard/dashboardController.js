const { OrderList, DriverList } = require('../../model');

// 通用聚合：近7天折线图数据
async function getLineData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const raw = await OrderList.aggregate([
    { $match: { createTime: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createTime' } },
        order: { $sum: 1 },
        money: { $sum: '$orderAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const label = [], order = [], money = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const found = raw.find(r => r._id === dateStr);
    label.push(dateStr);
    order.push(found ? found.order : 0);
    money.push(found ? found.money : 0);
  }
  return { label, order, money };
}

// ========== 报表卡片 ==========
exports.getReportData = async (ctx) => {
  const driverCount = await DriverList.countDocuments();
  const totalMoney = await OrderList.aggregate([
    { $group: { _id: null, total: { $sum: '$orderAmount' } } },
  ]);
  const orderCount = await OrderList.countDocuments();
  const cityNum = (await DriverList.distinct('cityName')).length;

  ctx.body = {
    code: 200,
    data: {
      driverCount,
      totalMoney: totalMoney[0]?.total || 0,
      orderCount,
      cityNum,
    },
  };
};

// ========== 折线图 ==========
exports.getLineData = async (ctx) => {
  const data = await getLineData();
  ctx.body = { code: 200, data };
};

// ========== 饼图（城市分布） ==========
exports.getPieCityData = async (ctx) => {
  const raw = await OrderList.aggregate([
    { $group: { _id: '$cityName', value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: 6 },
  ]);
  const data = raw.map(r => ({ name: r._id || '未知', value: r.value }));
  ctx.body = { code: 200, data };
};

// ========== 饼图2（司机年龄段分布） ==========
exports.getPieAgeData = async (ctx) => {
  const drivers = await DriverList.find({}, 'age').lean();

  const groups = [
    { name: '18-25岁', min: 18, max: 25 },
    { name: '26-35岁', min: 26, max: 35 },
    { name: '36-45岁', min: 36, max: 45 },
    { name: '46-55岁', min: 46, max: 55 },
    { name: '56岁以上', min: 56, max: 100 },
  ];

  const data = groups.map(g => ({
    name: g.name,
    value: drivers.filter(d => d.age >= g.min && d.age <= g.max).length,
  }));

  ctx.body = { code: 200, data };
};

// ========== 雷达图 ==========
exports.getRadarData = async (ctx) => {
  const r = await DriverList.aggregate([
    { $match: { accountStatus: { $in: [1, 2, 3, 4] } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        avgOnlineTime: { $avg: '$onlineTime' },
        avgOrderComplete: { $avg: '$orderCompleteCount' },
        avgDriverLevel: { $avg: '$driverLevel' },
      },
    },
  ]);

  const avg = r[0] || {};
  ctx.body = {
    code: 200,
    data: {
      indicator: [
        { name: '服务态度', max: 10 },
        { name: '在线时长', max: 600 },
        { name: '接单率', max: 100 },
        { name: '评分', max: 5 },
        { name: '关注度', max: 10000 },
      ],
      data: {
        value: [
          Number(((avg.avgRating || 0) * 2).toFixed(1)),
          Number((avg.avgOnlineTime || 0).toFixed(1)),
          Number(((avg.avgOrderComplete || 0)).toFixed(1)),
          Number((avg.avgRating || 0).toFixed(1)),
          9000,
        ],
        name: '司机模型诊断',
      },
    },
  };
};
