# System - Dept 部门管理接口

Base URL: `/api/system/dept`

---

## 获取部门列表

```
GET /system/dept/getDeptList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| deptName | string | 部门名称（精确匹配） |

**响应** — 返回树形结构数据

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "_id": "...",
      "deptName": "技术部",
      "parentId": "",
      "userName": "张三",
      "children": [
        {
          "_id": "...",
          "deptName": "前端组",
          "parentId": "...",
          "userName": "李四",
          "children": []
        }
      ]
    }
  ]
}
```

---

## 搜索部门列表

```
GET /system/dept/searchDeptList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| deptName | string | 部门名称（模糊匹配） |

**说明** — 支持模糊搜索，并自动包含父级部门

**响应** — 返回树形结构数据

---

## 根据ID获取部门

```
GET /system/dept/getDeptById
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 部门 ObjectId |

**响应**

```json
{
  "code": 200,
  "data": {
    "_id": "...",
    "deptName": "技术部",
    "parentId": "",
    "userName": "张三"
  }
}
```

---

## 添加部门

```
POST /system/dept/addDept
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deptName | string | 是 | 部门名称 |
| userName | string | 是 | 负责人 |
| parentId | string | 否 | 父部门 ObjectId |

**响应**

```json
{
  "code": 200,
  "message": "添加成功"
}
```

---

## 编辑部门

```
POST /system/dept/editDept
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 部门 ObjectId |
| deptName | string | 是 | 部门名称 |
| userName | string | 是 | 负责人 |
| parentId | string | 否 | 父部门 ObjectId |

**响应**

```json
{
  "code": 200,
  "message": "修改成功"
}
```

---

## 删除部门

```
POST /system/dept/deleteDept
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 部门 ObjectId |

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
  "message": "该部门下存在子部门，无法删除"
}
```

> 注意：如部门下存在子部门，无法删除
