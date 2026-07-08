# Order - DriverList 司机列表接口

Base URL: `/api/order/order`

---

## 获取司机列表

```
GET /order/order/getDriverList
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
        "driverId": "D001",
        "driverName": "李师傅",
        "driverPhone": "13800138000",
        "cityName": "北京",
        "grade": false,
        "driverLevel": 5,
        "accountStatus": 1,
        "carNo": "京A12345",
        "vehicleBrand": "比亚迪",
        "vehicleName": "秦PLUS",
        "onlineTime": 360,
        "driverAmount": 15000,
        "rating": 4.8,
        "driverScore": 95,
        "pushOrderCount": 200,
        "orderCompleteCount": 150,
        "createTime": "2026-07-01T00:00:00.000Z"
      }
    ],
    "page": {
      "total": 50,
      "pageNum": 1,
      "pageSize": 10
    }
  }
}
```

**accountStatus 账户状态说明**

| 值 | 说明 |
|----|------|
| 0 | 出车中 |
| 1 | 收车 |
| 2 | 暂停 |
| 3 | 维护 |
| 4 | 销户 |

---

## 搜索司机

```
GET /order/order/searchDriver
```

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| driverName | string | 司机名称（模糊匹配） |
| accountStatus | number | 账户状态 |
| pageNum | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 10 |

**响应**

```json
{
  "code": 200,
  "data": {
    "list": [...],
    "page": {
      "total": 10,
      "pageNum": 1,
      "pageSize": 10
    }
  }
}
```

---

## 创建司机

```
POST /order/order/createDriver
```

**Body 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| driverName | string | 是 | 司机名称 |
| driverId | string | 是 | 司机ID（唯一） |
| driverPhone | string | 是 | 手机号 |
| cityName | string | 是 | 城市 |
| driverLevel | number | 是 | 司机等级 |
| accountStatus | number | 是 | 账户状态 |
| carNo | string | 是 | 车牌号 |
| vehicleBrand | string | 是 | 车辆品牌 |
| vehicleName | string | 是 | 车型 |
| onlineTime | number | 否 | 在线时长（小时），默认 0 |
| driverAmount | number | 否 | 司机金额，默认 0 |
| rating | number | 否 | 评分，默认 0 |
| driverScore | number | 否 | 司机得分，默认 0 |
| pushOrderCount | number | 否 | 推送订单数，默认 0 |
| orderCompleteCount | number | 否 | 完成订单数，默认 0 |

**响应**

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "...",
    "driverId": "D001"
  }
}
```

---

## 编辑司机

```
POST /order/order/updateDriver/:driverId
```

**Path 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| driverId | string | 是 | 司机ID |

**Body 参数** — 支持部分更新

| 参数 | 类型 | 说明 |
|------|------|------|
| driverName | string | 司机名称 |
| driverPhone | string | 手机号 |
| cityName | string | 城市 |
| grade | boolean | 是否升级 |
| driverLevel | number | 司机等级 |
| accountStatus | number | 账户状态 |
| carNo | string | 车牌号 |
| vehicleBrand | string | 车辆品牌 |
| vehicleName | string | 车型 |
| onlineTime | number | 在线时长 |
| driverAmount | number | 司机金额 |
| rating | number | 评分 |
| driverScore | number | 司机得分 |
| pushOrderCount | number | 推送订单数 |
| orderCompleteCount | number | 完成订单数 |

**响应**

```json
{
  "code": 200,
  "message": "更新成功",
  "data": { ... }
}
```

---

## 删除司机

```
POST /order/order/deleteDriver/:driverId
```

**Path 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| driverId | string | 是 | 司机ID |

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
  "code": 404,
  "message": "司机不存在或已删除"
}
```
