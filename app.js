//导入express
const express = require("express");
//创建服务器实例对象
const app = express();

const joi = require("joi");

//导入并配置cors中间件
const cors = require("cors");
app.use(cors());

//在路由之前封装res.cc函数
app.use((req, res, next) => {
  //status的默认值为1，表示失败的情况
  //err的值可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

//在路由之前配置解析Token的中间间
const expressJWT = require("express-jwt");
const config = require("./config");

app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);

//配置解析表单数据的中间件 只能解析该数据的格式：application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//托管静态资源文件
app.use("/uploads", express.static("./uploads"));

//启动服务器
app.listen(3007, function () {
  console.log("api server running at http://127.0.0.1:3007");
});

//导入并注册用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);

//导入用户信息模块
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);

//导入文章分类路由模块
const artCateRouter = require("./router/artcate");
app.use("/my/article", artCateRouter);

//导入并使用文章的路由模块
const articleRouter = require("./router/article");
app.use("/my/article", articleRouter);

//错误中间件
app.use(function (err, req, res, next) {
  //数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);

  //捕获身份认证失败的错误
  if (err.name === "UnauthorzedError") return res.cc("身份认证失败");
  //未知错误
  res.cc(err);
});
