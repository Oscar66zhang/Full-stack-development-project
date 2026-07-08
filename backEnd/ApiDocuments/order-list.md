# Order - OrderList 订单列表接口

Base URL: `/api/order/order`

---

## 获取订单列表

```
GET /order/order/getOrderList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| pageNum | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 10 |

**响应**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "...",
        "orderId": "ORD202607080001",
        "cityName": "北京",
        "userName": "王五",
        "mobile": "13800138000",
        "startAddress": "北京市朝阳区建国路",
        "endAddress": "北京市海淀区中关村",
        "orderAmount": 100,
        "userPayAmount": 90,
        "driverAmount": 80,
        "payType": 1,
        "driverName": "李师傅",
        "vehicleName": "比亚迪秦PLUS",
        "state": 1,
        "useTime": "2026-07-08 10:00:00",
        "endTime": "2026-07-08 11:00:00",
        "route": [
          { "lng": "116.397428", "lat": "39.90923" },
          { "lng": "116.398428", "lat": "39.91023" }
        ],
        "remark": "",
        "createTime": "2026-07-08T02:00:00.000Z"
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

**state 订单状态说明**

| 值 | 说明 |
|----|------|
| 1 | 进行中 |
| 2 | 已完成 |
| 3 | 超时 |
| 4 | 取消 |

**payType 支付方式说明**

| 值 | 说明 |
|----|------|
| 1 | 微信 |
| 2 | 支付宝 |

---

## 搜索订单

```
GET /order/order/searchOrderList
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| orderId | string | 订单ID（模糊匹配） |
| userName | string | 用户名（模糊匹配） |
| state | number | 订单状态 |
| pageNum | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 10 |

**响应**

```json
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 50,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

---

## 获取订单详情

```
GET /order/order/getOrderDetail/:orderId
```

**Path 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | string | 是 | 订单ID，支持 `_id` 或 `orderId` |

**响应**

```json
{
  "code": 200,
  "data": {
    "_id": "...",
    "orderId": "ORD202607080001",
    "cityName": "北京",
    "userName": "王五",
    "mobile": "13800138000",
    "startAddress": "北京市朝阳区建国路",
    "endAddress": "北京市海淀区中关村",
    "orderAmount": 100,
    "userPayAmount": 90,
    "driverAmount": 80,
    "payType": 1,
    "driverName": "李师傅",
    "vehicleName": "比亚迪秦PLUS",
    "state": 1,
    "useTime": "2026-07-08 10:00:00",
    "endTime": "2026-07-08 11:00:00",
    "route": [...],
    "remark": "",
    "createTime": "2026-07-08T02:00:00.000Z"
  }
}
```

---

## 创建订单

```
POST /order/order/createOrderList
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cityName | string | 是 | 城市 |
| userName | string | 是 | 用户名 |
| driverName | string | 是 | 司机名 |
| vehicleName | string | 是 | 车型 |
| driverAmount | number | 是 | 司机金额 |
| orderAmount | number | 否 | 订单金额 |
| userPayAmount | number | 否 | 用户支付金额 |
| mobile | string | 否 | 手机号 |
| startAddress | string | 否 | 起始地址 |
| endAddress | string | 否 | 结束地址 |
| route | array | 否 | 轨迹点 `[{lng, lat}]` |

**响应**

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "...",
    "orderId": "ORD202607080001"
  }
}
```

---

## 删除订单

```
DELETE /order/order/deleteOrderList/:_id
```

**Path 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 是 | 订单 ObjectId |

**响应**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 更新订单轨迹打点

```
POST /order/order/updateOrderRoute
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 否 | 订单 ObjectId（与 orderId 二选一） |
| orderId | string | 否 | 订单ID（与 _id 二选一） |
| route | array | 是 | 轨迹点坐标数组 |

**route 结构**

```json
[{ "lng": "116.397428", "lat": "39.90923" }]
```

**响应**

```json
{
  "code": 200,
  "message": "打点保存成功",
  "data": { ... }
}
```

---

## 导出订单

```
GET /order/order/exportOrderList
```

**说明** — 导出所有订单为 Excel 文件

**响应** — Excel 文件流

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=order_list.xlsx
```

**导出字段**

| Excel 列名 | 对应字段 |
|------------|----------|
| 订单ID | orderId |
| 城市 | cityName |
| 用户名称 | userName |
| 手机号 | mobile |
| 开始地址 | startAddress |
| 结束地址 | endAddress |
| 订单金额 | orderAmount |
| 支付金额 | userPayAmount |
| 司机金额 | driverAmount |
| 支付方式 | payType |
| 司机名称 | driverName |
| 车型 | vehicleName |
| 订单状态 | state |
| 用车时间 | useTime |
| 结束时间 | endTime |
| 轨迹点数 | route.length |
| 创建时间 | createTime |
| 备注 | remark |
