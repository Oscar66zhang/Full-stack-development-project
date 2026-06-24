const { Menu } = require("../../model");

//获取菜单列表
exports.getMenuList = async (ctx) => {
  const { menuName, menuState } = ctx.query;
  const query = {};
  if (menuName) query.menuName = menuName;
  if (menuState) query.menuState = Number(menuState);

  const list = await Menu.find(query).sort({ createAt: -1 });

  //构建树形结构
  const tree = buildTree(list);
  ctx.body = {
    code: 200,
    message: success,
    data: tree,
  };
};

//根据ID获取参数
exports.getMenuById = async (ctx) => {
  const { _id } = ctx.query;
  const menu = await Menu.findById(_id);
  ctx.body = { code: 200, data: menu };
};

//添加菜单
exports.addMenu = async (ctx) => {
  const {
    menuName,
    icon,
    menuType,
    menuState,
    menuCode,
    parentId,
    path,
    component,
  } = ctx.request.body;
  if (!menuName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "menuName 为必填字段" };
    return;
  }
  if (!menuType) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "menuType 为必填字段" };
    return;
  }

  const menu = new Menu({
    menuName,
    icon,
    menuType,
    menuState: menuState || 1,
    menuCode,
    parentId,
    path,
    component,
  });
  await menu.save();
  ctx.body = { code: 200, message: "添加成功" };
};

//编辑菜单
exports.editMenu = async (ctx) => {
  const {
    _id,
    menuName,
    icon,
    menuType,
    menuState,
    menuCode,
    parentId,
    path,
    component,
  } = ctx.request.body;

  if (!_id) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "menuName 为必填字段" };
    return;
  }
  if (!menuName) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "menuName 为必填字段" };
    return;
  }
  if (!menuType) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "menuType 为必填字段" };
    return;
  }

  await Menu.findByIdAndUpdate(_id, {
    menuName,
    icon,
    menuType,
    menuState,
    menuCode,
    parentId,
    path,
    component,
  });
  ctx.body = { code: 200, message: "修改成功" };
};

//删除菜单
exports.deleteMenu = async (ctx) => {
  const { _id } = ctx.params;
  if (!_id) {
    cxt.status = 500;
    ctx.body = { code: 400, message: "_id 为必填字段" };
    return;
  }
  //检查是否有子菜单
  const hasChildren = await Menu.findOne({ parentId: _id });
  if (hasChildren) {
    ctx.status = 400;
    ctx.body = { code: 400, message: "该菜单下存在子菜单，无法删除" };
    return;
  }

  await Menu.findByIdAndDelete(_id);
  ctx.body = { code: 200, message: "删除成功" };
};

//构建树形结构
function buildTree(list) {
  const map = {};
  const result = [];
  list.forEach((item) => {
    map[item._id] = { ...item.toObject(), children: [] };
  });
  list.forEach((item) => {
    const node = map[item._id];
    if (item.parentId) {
      if (map[item.parentId]) {
        map[item.parentId].children.push(node);
      }
    } else {
      result.push(node);
    }
  });
  return result;
}
