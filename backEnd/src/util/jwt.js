const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// 将 jwt.sign 转为 Promise 版本（支持 async/await）
const tojwt = promisify(jwt.sign);

// 将 jwt.verify 转为 Promise 版本
const verify = promisify(jwt.verify);

// 验证 token 中间件
module.exports.verifyToken = function (required = true) {
    return async (ctx, next) => {
        // 从请求头获取 token，格式：Bearer <token>
        var token = ctx.headers.authorization;
        token = token ? token.split(' ')[1] : null;

        if (token) {
            try {
                // 验证 token 并解析用户信息
                var userinfo = await verify(token, 'koa-viode');
                ctx.user = userinfo;
                await next();
            } catch (error) {
                // token 无效或已过期
                console.log('token验证失败，错误原因:', error.message)
                ctx.status = error.status || 402;
                ctx.body = error.message;
                return;
            }
        } else if (required) {
            // 没有 token 且不允许匿名访问
            ctx.throw(402, '无效的token');
        } else {
            // 没有 token 但允许匿名访问
            await next();
        }
    }
}

// 创建 token
module.exports.createToken = async userInfo => {
    // 签发 token，有效期 24 小时
    var token = await tojwt({ userInfo }, 'koa-viode', {
        expiresIn: 60 * 60 * 24
    })
    return token
}