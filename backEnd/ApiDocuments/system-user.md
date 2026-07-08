# System - User 用户管理接口

Base URL: `/api/system/users`

---

## 获取用户列表

```
GET /system/users/getUserList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| userId | number | 用户ID（精确匹配） |
| userName | string | 用户名（模糊匹配） |
| userEmail | string | 邮箱（模糊匹配） |
| deptName | string | 部门名（模糊匹配） |
| state | string | 状态 |
| role | string | 角色 |
| pageNum | number | 页码，默认 1 |
| size | number | 每页条数，默认 10 |

**响应**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "...",
        "userId": 1001,
        "userName": "张三",
        "userEmail": "zhangsan@example.com",
        "deptName": "技术部",
        "state": "1",
        "role": "admin"
      }
    ],
    "total": 50
  }
}
```

---

## 根据ID获取用户

```
GET /system/users/getUserById
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |

**响应**

```json
{
  "code": 200,
  "data": {
    "_id": "...",
    "userId": 1001,
    "userName": "张三",
    "userEmail": "zhangsan@example.com",
    "deptName": "技术部"
  }
}
```

---

## 搜索用户

```
GET /system/users/searchUser
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词，模糊匹配 userName、userId、state |

**响应**

```json
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 5
  }
}
```

---

## 添加用户

```
POST /system/users/addUser
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userName | string | 是 | 用户名 |
| userEmail | string | 是 | 邮箱 |
| deptName | string | 是 | 部门 |

**响应**

```json
{
  "code": 200,
  "message": "添加成功"
}
```

---

## 编辑用户

```
POST /system/users/editUser
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID |
| userName | string | 是 | 用户名 |
| userEmail | string | 是 | 邮箱 |
| deptName | string | 是 | 部门 |

**响应**

```json
{
  "code": 200,
  "message": "修改成功"
}
```

---

## 删除用户

```
POST /system/users/deleteUser
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number[] | 是 | 用户ID数组，支持批量删除 |

**响应**

```json
{
  "code": 200,
  "message": "删除成功"
}
```
