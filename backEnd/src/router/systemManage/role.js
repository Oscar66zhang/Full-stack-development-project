const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const roleController = require("../../controllers/systemManage/roleController");

router.get(
  "/roles/getRoleList",
  verifyToken(false),
  roleController.getRoleList,
);
router.get(
  "/roles/getRoleById",
  verifyToken(false),
  roleController.getRoleById,
);
router.post(
  "/roles/updatePermission",
  verifyToken(false),
  roleController.updatePermission,
);

router.post("/roles/addRole", verifyToken(false), roleController.addRole);
router.post("/roles/editRole", verifyToken(false), roleController.editRole);
router.post("/roles/deleteRole", verifyToken(false), roleController.deleteRole);

module.exports = router;
