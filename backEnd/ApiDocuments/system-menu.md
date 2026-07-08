# System - Menu 菜单管理接口

Base URL: `/api/system/menu`

---

## 获取菜单列表

```
GET /system/menu/getMenuList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| menuName | string | 菜单名称（模糊匹配） |
| menuState | number | 菜单状态 |

**响应** — 返回树形结构数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "_id": "...",
      "menuName": "系统管理",
      "icon": "SettingOutlined",
      "menuType": 1,
      "menuState": 1,
      "menuCode": "system",
      "parentId": "",
      "path": "/system",
      "component": "",
      "children": [
        {
          "_id": "...",
          "menuName": "用户管理",
          "icon": "TeamOutlined",
          "menuType": 2,
          "menuState": 1,
          "menuCode": "user",
          "parentId": "...",
          "path": "/system/user",
          "component": "/systemManage/user/index",
          "children": []
        }
      ]
    }
  ]
}
```

---

## 搜索菜单列表

```
GET /system/menu/searchMenuList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| menuName | string | 菜单名称（模糊匹配） |
| menuState | number | 菜单状态 |

**说明** — 支持模糊搜索，并自动包含父级菜单

**响应** — 返回树形结构数据

---

## 根据ID获取菜单

```
GET /system/menu/getMenuById
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 菜单 ObjectId |

**响应**

```json
{
  "code": 200,
  "data": {
    "_id": "...",
    "menuName": "用户管理",
    "icon": "TeamOutlined",
    "menuType": 2,
    "menuState": 1,
    "menuCode": "user",
    "parentId": "...",
    "path": "/system/user",
    "component": "/systemManage/user/index"
  }
}
```

---

## 添加菜单

```
POST /system/menu/addMenu
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| menuName | string | 是 | 菜单名称 |
| menuType | number | 是 | 菜单类型 |
| icon | string | 否 | 图标 |
| menuState | number | 否 | 状态，默认 1 |
| menuCode | string | 否 | 菜单编码 |
| parentId | string | 否 | 父菜单 ObjectId |
| path | string | 否 | 路由路径 |
| component | string | 否 | 组件路径 |

**menuType 说明**

| 值 | 说明 |
|----|------|
| 1 | 目录 |
| 2 | 菜单 |
| 3 | 按钮 |

**响应**

```json
{
  "code": 200,
  "message": "添加成功"
}
```

---

## 编辑菜单

```
POST /system/menu/editMenu
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 菜单 ObjectId |
| menuName | string | 是 | 菜单名称 |
| menuType | number | 是 | 菜单类型 |
| icon | string | 否 | 图标 |
| menuState | number | 否 | 状态 |
| menuCode | string | 否 | 菜单编码 |
| parentId | string | 否 | 父菜单 ObjectId |
| path | string | 否 | 路由路径 |
| component | string | 否 | 组件路径 |

**响应**

```json
{
  "code": 200,
  "message": "修改成功"
}
```

---

## 删除菜单

```
POST /system/menu/deleteMenu
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 菜单 ObjectId |

**响应**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

**错误响应**

```json
{
  "code": 400,
  "message": "该菜单下存在子菜单，无法删除"
}
```

> 注意：如菜单下存在子菜单，无法删除
