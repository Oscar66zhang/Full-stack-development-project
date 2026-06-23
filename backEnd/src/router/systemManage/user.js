const Router = require('@koa/router');
const router = new Router()
const { verifyToken } = require("../../util/jwt");

//用户模块
const userController = require('../../controllers/userController');

router.get('/users/getUserList', verifyToken(false), userController.getUserList);
router.get('/users/getUserById', verifyToken(false), userController.getUserById);
router.post('/users/addUser', verifyToken(false), userController.addUser);
router.post('/users/editUser', verifyToken(false), userController.editUser);
router.post('/users/deleteUser', verifyToken(false), userController.deleteUser);


module.exports = router;

