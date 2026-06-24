const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const menuController = require("../../controllers/systemManage/menuController");

router.get("/menu/getMenuList", verifyToken(false), menuController.getMenuList);
router.get("/menu/getMenuById", verifyToken(false), menuController.getMenuById);
router.post("/menu/addMenu", verifyToken(false), menuController.addMenu);
router.post("/menu/editMenu", verifyToken(false), menuController.editMenu);
router.post("/menu/deleteMenu", verifyToken(false), menuController.deleteMenu);

module.exports = router;
