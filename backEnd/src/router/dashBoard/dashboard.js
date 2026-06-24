const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const dashboardController = require("../../controllers/dashBoard/dashboardController");

router.get("/dashboard/getReport", verifyToken(false), dashboardController.getReport);

module.exports = router;
