const Router = require("@koa/router");
const router = new Router();
const { verifyToken } = require("../../util/jwt");
const deptController = require("../../controllers/systemManage/deptController");

router.get("/dept/getDeptList", verifyToken(false), deptController.getDeptList);
router.get("/dept/getDeptById", verifyToken(false), deptController.getDeptById);
router.post("/dept/addDept", verifyToken(false), deptController.addDept);
router.post("/dept/editDept", verifyToken(false), deptController.editDept);
router.post("/dept/deleteDept", verifyToken(false), deptController.deleteDept);

module.exports = router;
