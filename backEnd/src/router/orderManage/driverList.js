const Router = require("@koa/router");
const router = new Router();

const { verifyToken } = require("../../util/jwt");
const driverListController = require("../../controllers/orderManage/driverListController");

//获取司机列表
router.get(
  "/order/getDriverList",
  verifyToken(false),
  driverListController.getDriverList,
);

//搜索司机
router.get(
  "/order/searchDriver",
  verifyToken(false),
  driverListController.searchDriver,
);

//创建司机列表
router.post(
  "/order/createDriver",
  verifyToken(false),
  driverListController.createDriver,
);

//编辑司机
router.post(
  "/order/updateDriver/:driverId",
  verifyToken(false),
  driverListController.updateDriver,
);

//删除司机
router.post(
  "/order/deleteDriver/:driverId",
  verifyToken(false),
  driverListController.deleteDriver,
);

module.exports = router;
