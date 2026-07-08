# 后端接口文档

云程运力调度管理平台后端 API 文档。

**Base URL**: `http://localhost:3000/api`

## 文档结构

- [Dashboard 工作台](./dashboard.md)
- [System - User 用户管理](./system-user.md)
- [System - Role 角色管理](./system-role.md)
- [System - Dept 部门管理](./system-dept.md)
- [System - Menu 菜单管理](./system-menu.md)
- [Order - OrderList 订单列表](./order-list.md)
- [Order - DriverList 司机列表](./order-driver.md)

---

## 通用规范

### 请求基础

所有接口均需要通过 `/api` 前缀访问，例如：`http://localhost:3000/api/dashboard/getReportData`

### 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |

### 分页响应格式

```json
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 数据模型

参见各模块文档。

### 环境变量

| 变量名 | 说明 |
|--------|------|
| AMAP_WEB_SERVICE_KEY | 高德地图 Web 服务 Key（用于地理编码和路线规划） |
