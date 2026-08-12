# 登录认证接口

Base URL: `/api/auth`

## 登录

```http
POST /api/auth/login
Content-Type: application/json
```

请求体：

```json
{
  "account": "Mike@example.com",
  "password": "123456"
}
```

`account` 支持用户名或邮箱。项目中原有的无密码用户可使用初始密码 `123456` 首次登录，登录成功后后端会自动写入带随机盐的 scrypt 密码哈希。通过用户管理新增用户时可直接设置登录密码。

成功响应：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "JWT_TOKEN",
    "userInfo": {}
  }
}
```

## 获取当前用户

```http
GET /api/auth/me
Authorization: Bearer JWT_TOKEN
```

Token 有效期为 24 小时。生产环境应通过 `JWT_SECRET` 环境变量配置独立且足够强的签名密钥。

除登录接口外，项目中的业务接口均需要携带有效的 Bearer Token。
