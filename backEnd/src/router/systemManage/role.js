const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const roleController = require('../../controllers/roleController')

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
router.post("/roles/addRole", verifyToken(false), roleController.addRole);
router.post("/roles/editRole", verifyToken(false), roleController.editRole);
router.post("/roles/deleteRole", verifyToken(false), roleController.deleteRole);

module.exports = router;
