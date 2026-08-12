const Router = require('@koa/router');
const router = new Router()
const { verifyToken } = require("../../util/jwt");

//用户模块
const userController = require('../../controllers/systemManage/userController');

router.get('/users/getUserList', verifyToken(), userController.getUserList);
router.get('/users/getUserById', verifyToken(), userController.getUserById);
router.get('/users/searchUser', verifyToken(), userController.searchUser);
router.post('/users/addUser', verifyToken(), userController.addUser);
router.post('/users/editUser', verifyToken(), userController.editUser);
router.post('/users/deleteUser', verifyToken(), userController.deleteUser);


module.exports = router;

