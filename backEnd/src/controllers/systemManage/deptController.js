const { Dept } = require("../../model");

//获取部门列表
exports.getDeptList = async (ctx) => {
  const { deptName } = ctx.query;
  const query = {};
  if (deptName) query.deptName = deptName;
  const list = await Dept.find(query).sort({ createAt: -1 });
  //构建树形结构
  const tree = buildTree(list);
  ctx.body = {
    code: 200,
    message: "success",
    data: tree,
  };
};

//根据ID获取
exports.getDeptById = async (ctx) => {
  const { _id } = ctx.query;
  const dept = await Dept.findById(_id);
  ctx.body = { code: 200, data: dept };
};

//添加部门
exports.addDept = async (ctx) => {
  const { deptName, parentId, userName } = ctx.request.body;
  if (!deptName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "deptName 为必填字段" };
    return;
  }
  if (!userName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "userName 为必填字段" };
    return;
  }
  const dept = new Dept({ deptName, parentId, userName });
  await dept.save();
  ctx.body = { code: 200, message: "添加成功" };
};

// 编辑部门
exports.editDept = async (ctx) => {
  const { _id, deptName, parentId, userName } = ctx.request.body;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "_id 为必填字段" };
    return;
  }
  if (!deptName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "deptName 为必填字段" };
    return;
  }
  if (!userName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "userName 为必填字段" };
    return;
  }

  await Dept.findByIdAndUpdate(_id, { deptName, parentId, userName });
  ctx.body = { code: 200, message: "修改成功" };
};

//删除部门
exports.deleteDept = async (ctx) => {
  const { _id } = ctx.params;
  if (!_id) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "_id is a required field" };
    return;
  }
  //检查部门是否存在
  const dept = await Dept.findById(_id);
  if (!dept) {
    ctx.status = 404;
    ctx.body = { code: 404, message: "The department does not exist" };
    return;
  }

  //检查是否有子部门
  const hasChildren = await Dept.findOne({ parentId: _id });
  if (hasChildren) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该部门下存在子部门，无法删除" };
    return;
  }

  await Dept.findByIdAndDelete(_id);

  ctx.body = {
    code: 200,
    message: "删除成功",
  };
};

// 构建树形结构
function buildTree(list) {
  const map = {}
  const result = []

  list.forEach(item => {
    const obj = item.toObject ? item.toObject() : item
    map[String(obj._id)] = {
      ...obj,
      _id: String(obj._id),
      parentId: obj.parentId ? String(obj.parentId) : '',
      children: []
    }
  })

  Object.values(map).forEach(node => {
    if (node.parentId && node.parentId !== '0' && map[node.parentId]) {
      map[node.parentId].children.push(node)
    } else {
      result.push(node)
    }
  })

  return result
}
