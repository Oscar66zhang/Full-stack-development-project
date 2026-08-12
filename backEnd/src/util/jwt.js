const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const JWT_SECRET = process.env.JWT_SECRET || 'koa-video-development-secret';

// 将 jwt.sign 转为 Promise 版本（支持 async/await）
const tojwt = promisify(jwt.sign);

// 将 jwt.verify 转为 Promise 版本
const verify = promisify(jwt.verify);

// 验证 token 中间件
module.exports.verifyToken = function (required = true) {
    return async (ctx, next) => {
        // 从请求头获取 token，格式：Bearer <token>
        const authorization = ctx.headers.authorization || '';
        const [scheme, token] = authorization.split(' ');
        const bearerToken = scheme === 'Bearer' ? token : null;

        if (bearerToken) {
            try {
                // 验证 token 并解析用户信息
                var userinfo = await verify(bearerToken, JWT_SECRET);
                ctx.user = userinfo;
                await next();
            } catch (error) {
                // token 无效或已过期
                console.log('token验证失败，错误原因:', error.message)
                ctx.status = 401;
                ctx.body = { code: 401, message: '登录已过期，请重新登录' };
                return;
            }
        } else if (required) {
            // 没有 token 且不允许匿名访问
            ctx.status = 401;
            ctx.body = { code: 401, message: '请先登录' };
            return;
        } else {
            // 没有 token 但允许匿名访问
            await next();
        }
    }
}

// 创建 token
module.exports.createToken = async userInfo => {
    // 签发 token，有效期 24 小时
    var token = await tojwt({ userInfo }, JWT_SECRET, {
        expiresIn: 60 * 60 * 24
    })
    return token
}
