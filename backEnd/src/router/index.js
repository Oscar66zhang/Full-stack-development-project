const Router = require("@koa/router");
const router = new Router({ prefix: "/api" }); //主路由

const authRouter = require("./auth");

//面板模块路由
const dashboardRouter = require("./dashBoard/dashboard");

//用户模块路由
const userRouter = require("./systemManage/user");
const roleRouter = require("./systemManage/role");
const deptRouter = require("./systemManage/dept");
const menuRouter = require("./systemManage/menu");

//订单模块路由
const orderListRouter = require("./orderManage/orderList");
const driverLisrRouter = require("./orderManage/driverList");

//==========================================注册子路由=======================================================================

//routes() 主要是把子路由注册到主路由(router)上
// allowedMethods() 主要负责处理 请求方法不对 的情况

//面板模块
router.use(authRouter.routes(), authRouter.allowedMethods());
router.use(dashboardRouter.routes(), dashboardRouter.allowedMethods());

//用户模块
router.use(userRouter.routes(), userRouter.allowedMethods());
router.use(roleRouter.routes(), roleRouter.allowedMethods());
router.use(deptRouter.routes(), deptRouter.allowedMethods());
router.use(menuRouter.routes(), menuRouter.allowedMethods());

//订单模块
router.use(orderListRouter.routes(), orderListRouter.allowedMethods());
router.use(driverLisrRouter.routes(), driverLisrRouter.allowedMethods());

module.exports = router;
