const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const deptController = require("../../controllers/systemManage/deptController");

router.get("/dept/getDeptList", verifyToken(), deptController.getDeptList);
router.get(
  "/dept/searchDeptList",
  verifyToken(),
  deptController.searchDeptList,
);
router.get("/dept/getDeptById", verifyToken(), deptController.getDeptById);
router.post("/dept/addDept", verifyToken(), deptController.addDept);
router.post("/dept/editDept", verifyToken(), deptController.editDept);
router.post("/dept/deleteDept", verifyToken(), deptController.deleteDept);

module.exports = router;
