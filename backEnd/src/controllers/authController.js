const { User } = require("../model");
const { createToken } = require("../util/jwt");
const { hashPassword, verifyPassword } = require("../util/password");

const INITIAL_PASSWORD = "123456";

function toSafeUser(user) {
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.__v;
  return safeUser;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.login = async (ctx) => {
  const account = String(ctx.request.body?.account || "").trim();
  const password = String(ctx.request.body?.password || "");

  if (!account || !password) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "请输入用户名或邮箱和密码" };
    return;
  }

  const accountPattern = new RegExp(`^${escapeRegExp(account)}$`, "i");
  const user = await User.findOne({
    $or: [{ userName: account }, { userEmail: accountPattern }],
  })
    .select("+password")
    .lean();

  if (!user) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "用户名或密码错误" };
    return;
  }

  // 兼容项目已有的无密码历史数据：首次用初始密码登录后立即补写安全哈希。
  const isLegacyUser = !user.password;
  const passwordMatched = isLegacyUser
    ? password === INITIAL_PASSWORD
    : verifyPassword(password, user.password);

  if (!passwordMatched) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "用户名或密码错误" };
    return;
  }

  if (user.state === 0) {
    ctx.status = 403;
    ctx.body = { code: 403, message: "账号已被禁用，请联系管理员" };
    return;
  }

  if (isLegacyUser) {
    user.password = hashPassword(password);
    await User.updateOne({ _id: user._id }, { password: user.password });
  }

  const userInfo = toSafeUser(user);
  const token = await createToken({
    id: String(user._id),
    userId: user.userId,
    userName: user.userName,
    role: user.role,
  });

  ctx.body = {
    code: 200,
    message: "登录成功",
    data: { token, userInfo },
  };
};

exports.getCurrentUser = async (ctx) => {
  const user = await User.findById(ctx.user.userInfo.id);

  if (!user) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "登录用户不存在" };
    return;
  }

  ctx.body = { code: 200, data: toSafeUser(user) };
};

// 登出（JWT 无状态，服务端不存储 token，只需记录日志）
exports.logout = async (ctx) => {
  const userName = ctx.user?.userInfo?.userName || '未知用户';
  console.log(`用户 ${userName} 已登出`);
  ctx.body = { code: 200, message: '登出成功' };
};

// 注册
exports.register = async (ctx) => {
  const { userName, userEmail, password, confirmPassword } = ctx.request.body;

  // 校验必填字段
  if (!userName || !userEmail || !password) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '用户名、邮箱、密码为必填字段' };
    return;
  }

  // 校验邮箱格式
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(userEmail)) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '邮箱格式不正确' };
    return;
  }

  // 校验密码长度
  if (password.length < 6) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '密码至少需要 6 位' };
    return;
  }

  // 校验两次密码是否一致
  if (password !== confirmPassword) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '两次输入的密码不一致' };
    return;
  }

  // 检查用户名是否已存在
  const existingUserName = await User.findOne({ userName });
  if (existingUserName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '该用户名已存在' };
    return;
  }

  // 检查邮箱是否已存在
  const existingUserEmail = await User.findOne({ userEmail });
  if (existingUserEmail) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '该邮箱已被注册' };
    return;
  }

  // 获取最大 userId 并 +1
  const maxUser = await User.findOne().sort({ userId: -1 });
  const userId = maxUser ? maxUser.userId + 1 : 1001;

  // 创建新用户
  const newUser = new User({
    userId,
    userName,
    userEmail,
    password,
    deptName: '默认部门',
    state: 1, // 启用状态
    role: 2, // 普通用户
  });

  await newUser.save();

  console.log(`新用户注册: ${userName} (${userEmail})`);

  ctx.body = { code: 200, message: '注册成功，请登录' };
};
