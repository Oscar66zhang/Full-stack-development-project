const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const roleController = require("../../controllers/systemManage/roleController");

router.get(
  "/roles/getRoleList",
  verifyToken(),
  roleController.getRoleList,
);
router.get(
  "/roles/getRoleById",
  verifyToken(),
  roleController.getRoleById,
);
router.post(
  "/roles/updatePermission",
  verifyToken(),
  roleController.updatePermission,
);

router.post("/roles/addRole", verifyToken(), roleController.addRole);
router.post("/roles/editRole", verifyToken(), roleController.editRole);
router.post("/roles/deleteRole", verifyToken(), roleController.deleteRole);

module.exports = router;
