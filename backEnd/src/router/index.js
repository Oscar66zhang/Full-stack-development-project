const Router = require('@koa/router');
const router = new Router({ prefix: "/api" })

//用户模块路由
const userRouter = require('./user');

//注册子路由
router.use(userRouter.routes(), userRouter.allowedMethods());

module.exports = router;