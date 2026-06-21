// 引入 Koa 框架
const Koa = require('koa');
// 引入 koa-body 中间件，用于解析请求体（支持 JSON、FormData、文件上传等）
const { koaBody } = require('koa-body');
// 引入路由模块
const router = require("./router")
// 引入 cors 中间件，处理跨域请求
const cors = require('@koa/cors');

// 创建 Koa 应用实例
const app = new Koa();

// 使用 cors 中间件，允许前端跨域访问
app.use(cors());

// 使用 koa-body 中间件，解析请求体
// multipart: true - 支持文件上传
// urlencoded: true - 支持 URL 编码的表单数据
app.use(koaBody({
    multipart: true,
    urlencoded: true
}))

// 注册路由，使用 router.routes() 匹配路由，router.allowedMethods() 处理未匹配的路由
app.use(router.routes());

// 统一错误处理中间件，捕获服务器错误并返回错误信息
app.on('error', (err, ctx) => {
    console.log(err);
    ctx.body = 'Server Err' + err
})

// 启动服务器，监听 3000 端口
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})
