# Dashboard 工作台接口

Base URL: `/api/dashboard`

---

## 获取报表卡片数据

```
GET /dashboard/getReportData
```

**响应**

```json
{
  "code": 200,
  "data": {
    "driverCount": 50,
    "totalMoney": 123456,
    "orderCount": 1000,
    "cityNum": 5
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| driverCount | number | 司机总数 |
| totalMoney | number | 订单总金额 |
| orderCount | number | 订单总数 |
| cityNum | number | 覆盖城市数 |

---

## 获取近7天折线图数据

```
GET /dashboard/getLineData
```

**响应**

```json
{
  "code": 200,
  "data": {
    "label": ["2026-07-02", "2026-07-03", "2026-07-04", "2026-07-05", "2026-07-06", "2026-07-07", "2026-07-08"],
    "order": [10, 15, 8, 20, 12, 18, 25],
    "money": [1000, 1500, 800, 2000, 1200, 1800, 2500]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| label | string[] | 日期列表 |
| order | number[] | 每日订单数 |
| money | number[] | 每日订单金额 |

---

## 获取城市分布饼图数据

```
GET /dashboard/getPieCityData
```

**响应**

```json
{
  "code": 200,
  "data": [
    { "name": "北京", "value": 120 },
    { "name": "上海", "value": 95 },
    { "name": "广州", "value": 80 },
    { "name": "深圳", "value": 65 }
  ]
}
```

---

## 获取司机年龄分布饼图数据

```
GET /dashboard/getPieAgeData
```

**响应**

```json
{
  "code": 200,
  "data": [
    { "name": "18-25岁", "value": 10 },
    { "name": "26-35岁", "value": 25 },
    { "name": "36-45岁", "value": 20 },
    { "name": "46-55岁", "value": 8 },
    { "name": "56岁以上", "value": 2 }
  ]
}
```

---

## 获取雷达图数据

```
GET /dashboard/getRadarData
```

**响应**

```json
{
  "code": 200,
  "data": {
    "indicator": [
      { "name": "服务态度", "max": 10 },
      { "name": "在线时长", "max": 600 },
      { "name": "接单率", "max": 100 },
      { "name": "评分", "max": 5 },
      { "name": "关注度", "max": 10000 }
    ],
    "data": {
      "value": [9.6, 360, 85, 4.8, 9000],
      "name": "司机模型诊断"
    }
  }
}
```
