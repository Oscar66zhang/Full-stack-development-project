const { Role } = require("../../model");

// 获取角色列表
exports.getRoleList = async (ctx) => {
  const { roleName, remark } = ctx.query;
  const pageNum = Number(ctx.query.pageNum) || 1;
  const pageSize = Number(ctx.query.pageSize) || 10;

  //构建查询条件
  const query = {};
  if (roleName) query.roleName = new RegExp(roleName, "i");
  if (remark) query.remark = new RegExp(remark, "i");
  const total = await Role.countDocuments(query);
  const list = await Role.find(query)
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1 });

  ctx.body = {
    code: 200,
    message: "success",
    data: {
      page: {
        pageNum,
        pageSize,
        total,
      },
      list,
    },
  };
};

//添加角色
exports.addRole = async (ctx) => {
  const { roleName, remark, permissionList } = ctx.request.body;
  if (!roleName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "roleName 为必填字段" };
    return;
  }

  // 检查角色名是否已存在
  const existingRole = await Role.findOne({ roleName });
  if (existingRole) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该角色名已存在" };
    return;
  }

  const role = new Role({
    roleName,
    remark,
    permissionList: permissionList || { checkedKeys: [], halfCheckedKeys: [] },
  });

  await role.save();

  ctx.body = { code: 200, message: "添加成功" };
};

// 编辑角色
exports.editRole = async (ctx) => {
  const { _id, roleName, remark, permissionList } = ctx.request.body;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "_id 为必填字段" };
    return;
  }

  if (!roleName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "roleName 为必填字段" };
    return;
  }

  // 检查角色名是否已被其他角色使用
  const existingRole = await Role.findOne({ roleName, _id: { $ne: _id } });
  if (existingRole) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该角色名已存在" };
    return;
  }

  await Role.findByIdAndUpdate(_id, {
    roleName,
    remark,
    permissionList: permissionList || { checkedKeys: [], halfCheckedKeys: [] },
  });

  ctx.body = { code: 200, message: "修改成功" };
};

//删除角色
exports.deleteRole = async (ctx) => {
  const { _id } = ctx.request.body;
  await Role.findByIdAndDelete(_id);
  ctx.body = { code: 200, message: "删除成功" };
};

// 根据ID获取角色
exports.getRoleById = async (ctx) => {
  const { _id } = ctx.query;
  const role = await Role.findById(_id);
  ctx.body = { code: 200, data: role };
};
