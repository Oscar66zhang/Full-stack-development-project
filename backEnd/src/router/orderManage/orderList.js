const Router = require("@koa/router");
const router = new Router();

const { verifyToken } = require("../../util/jwt");
const orderListController = require("../../controllers/orderManage/orderListController");

// 获取订单列表
router.get(
  "/order/getOrderList",
  verifyToken(false),
  orderListController.getOrderList,
);

// 查询订单
router.get(
  "/order/searchOrderList",
  verifyToken(false),
  orderListController.searchOrderList,
);

// 导出订单
router.get(
  "/order/exportOrderList",
  verifyToken(false),
  orderListController.exportOrderList,
);

// 创建订单
router.post(
  "/order/createOrderList",
  verifyToken(false),
  orderListController.createOrderList,
);

module.exports = router;
