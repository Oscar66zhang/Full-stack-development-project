const Router = require("@koa/router");
const authController = require("../controllers/authController");
const { verifyToken } = require("../util/jwt");

const router = new Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/logout", verifyToken(), authController.logout);
router.get("/auth/me", verifyToken(), authController.getCurrentUser);

module.exports = router;
