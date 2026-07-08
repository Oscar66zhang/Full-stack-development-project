# System - Role 角色管理接口

Base URL: `/api/system/roles`

---

## 获取角色列表

```
GET /system/roles/getRoleList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| roleName | string | 角色名（模糊匹配） |
| remark | string | 备注（模糊匹配） |
| pageNum | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 10 |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "page": {
      "pageNum": 1,
      "pageSize": 10,
      "total": 5
    },
    "list": [
      {
        "_id": "...",
        "roleName": "管理员",
        "remark": "系统管理员",
        "permissionList": {
          "checkedKeys": ["key1", "key2"],
          "halfCheckedKeys": ["key3"]
        },
        "createAt": "2026-07-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 根据ID获取角色

```
GET /system/roles/getRoleById
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 角色 ObjectId |

**响应**

```json
{
  "code": 200,
  "data": {
    "_id": "...",
    "roleName": "管理员",
    "remark": "系统管理员",
    "permissionList": {
      "checkedKeys": [],
      "halfCheckedKeys": []
    }
  }
}
```

---

## 添加角色

```
POST /system/roles/addRole
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roleName | string | 是 | 角色名称 |
| remark | string | 否 | 备注 |
| permissionList | object | 否 | 权限列表 |

**permissionList 结构**

```json
{
  "checkedKeys": ["key1", "key2"],
  "halfCheckedKeys": ["key3"]
}
```

**响应**

```json
{
  "code": 200,
  "message": "添加成功"
}
```

---

## 编辑角色

```
POST /system/roles/editRole
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 角色 ObjectId |
| roleName | string | 是 | 角色名称 |
| remark | string | 否 | 备注 |
| permissionList | object | 否 | 权限列表 |

**响应**

```json
{
  "code": 200,
  "message": "修改成功"
}
```

---

## 删除角色

```
POST /system/roles/deleteRole
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 角色 ObjectId |

**响应**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 更新角色权限

```
POST /system/roles/updatePermission
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 角色 ObjectId |
| permissionList | object | 是 | 权限列表 |

**permissionList 结构**

```json
{
  "checkedKeys": ["key1", "key2"],
  "halfCheckedKeys": ["key3"]
}
```

**响应**

```json
{
  "code": 200,
  "message": "权限设置成功"
}
```
