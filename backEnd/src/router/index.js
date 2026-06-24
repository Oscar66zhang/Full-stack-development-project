const Router = require("@koa/router");
const router = new Router({ prefix: "/api" });

//用户模块路由
const userRouter = require("./systemManage/user");
const roleRouter = require("./systemManage/role");
const deptRouter = require("./systemManage/dept");
const menuRouter = require("./systemManage/menu");
const dashboardRouter = require("./systemManage/dashboard");

//注册子路由
router.use(userRouter.routes(), userRouter.allowedMethods());
router.use(roleRouter.routes(), roleRouter.allowedMethods());
router.use(deptRouter.routes(), deptRouter.allowedMethods());
router.use(menuRouter.routes(), menuRouter.allowedMethods());
router.use(dashboardRouter.routes(), dashboardRouter.allowedMethods());

module.exports = router;
