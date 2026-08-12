const Router = require("@koa/router");
const router = new Router();

const { verifyToken } = require("../../util/jwt");
const orderListController = require("../../controllers/orderManage/orderListController");

// 获取订单列表
router.get(
  "/order/getOrderList",
  verifyToken(),
  orderListController.getOrderList,
);

// 查询订单
router.get(
  "/order/searchOrderList",
  verifyToken(),
  orderListController.searchOrderList,
);

// 获取订单详情
router.get(
  "/order/getOrderDetail/:orderId",
  verifyToken(),
  orderListController.getOrderDetail,
);

// 导出订单
router.get(
  "/order/exportOrderList",
  verifyToken(),
  orderListController.exportOrderList,
);

// 创建订单
router.post(
  "/order/createOrderList",
  verifyToken(),
  orderListController.createOrderList,
);

// 删除订单
router.post(
  "/order/deleteOrderList/:_id",
  verifyToken(),
  orderListController.deleteOrderList,
);

// 更新订单打点
router.post(
  "/order/updateOrderRoute",
  verifyToken(),
  orderListController.updateOrderRoute,
);

module.exports = router;
