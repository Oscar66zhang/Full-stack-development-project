const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const menuController = require("../../controllers/systemManage/menuController");

router.get("/menu/getMenuList", verifyToken(), menuController.getMenuList);
router.get("/menu/searchMenuList", verifyToken(), menuController.searchMenuList);
router.get("/menu/getMenuById", verifyToken(), menuController.getMenuById);
router.post("/menu/addMenu", verifyToken(), menuController.addMenu);
router.post("/menu/editMenu", verifyToken(), menuController.editMenu);
router.post("/menu/deleteMenu", verifyToken(), menuController.deleteMenu);

module.exports = router;
