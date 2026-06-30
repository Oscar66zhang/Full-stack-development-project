const { User } = require("../../model");
const { createToken } = require("../../util/jwt");

//获取用户
exports.getUserList = async (ctx) => {
  const { userName, userEmail, deptName, state, role } = ctx.query;
  const page = ctx.query.page || 1;
  const size = ctx.query.size || 10;

  //构建查询添加
  const query = {};
  if (userName) query.userName = userName;
  if (userEmail) query.userEmail = userEmail;
  if (deptName) query.deptName = deptName;
  if (state !== undefined) query.state = state;
  if (role !== undefined) query.role = role;

  const total = await User.countDocuments(query);
  const list = await User.find(query)
    .skip((page - 1) * size)
    .limit(Number(size))
    .sort({ userId: -1 });
  ctx.body = { code: 200, data: { list, total } };
};

//添加用户
exports.addUser = async (ctx) => {
  const { userName, userEmail, deptName } = ctx.request.body;
  //校验必填字段
  if (!userName || !userEmail || !deptName) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: "userName、userEmail、deptName 为必填字段",
    };
    return;
  }

  //校验邮箱格式
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(userEmail)) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "邮箱格式不正确" };
    return;
  }

  //建议邮箱是否已存在
  const existingUser = await User.findOne({ userEmail });
  if (existingUser) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该邮箱已被注册" };
    return;
  }

  const userModel = new User(ctx.request.body);
  await userModel.save();
  ctx.body = { code: 200, message: "添加成功" };
};

//编辑用户
exports.editUser = async (ctx) => {
  const { userName, userEmail, deptName } = ctx.request.body;

  //校验必填字段
  if (!userName || !userEmail || !deptName) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: "userName、userEmail、deptName 为必填字段",
    };
    return;
  }

  const existingUserName = await User.findOne({ userName, _id: { $ne: _id } });

  //校验用户名是否存在
  if (existingUserName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该名称已存在" };
    return;
  }

  //校验邮箱格式
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(userEmail)) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "邮箱格式不正确" };
    return;
  }

  //建议邮箱是否已存在
  const existingUser = await User.findOne({ userEmail, _id: { $ne: _id } });
  if (existingUser) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该邮箱已被注册" };
    return;
  }

  const { userId, ...updateData } = ctx.request.body;
  await User.findByIdAndUpdate(userId, updateData);
  ctx.body = { code: 200, message: "修改成功" };
};

//删除用户
exports.deleteUser = async (ctx) => {
  const { userId } = ctx.request.body;
  if (!Array.isArray(userId) || userId.length === 0) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: "用户ID不能为空",
    };
    return;
  }

  await User.deleteMany({
    userId: {
      $in: userId,
    },
  });

  ctx.body = {
    code: 200,
    message: "删除成功",
  };
};

//根据ID获取用户
exports.getUserById = async (ctx) => {
  const { userId } = ctx.query;
  const user = await User.findById(userId);
  ctx.body = { code: 200, data: user };
};
