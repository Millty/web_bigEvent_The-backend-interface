const express = require("express");
//创建路由对象
const router = express.Router();

//导入用户路由处理函数对应的模块
const user_handler = require("../router_handler/user");

//导入验证数据的中间间
const expressJoi = require("@escook/express-joi");
//导入需要验证规则的对象
const { reg_login_schema } = require("../schema/user");

//注册
//注册用户的路由里声明局部中间件，对当前请求中携带的数据进行验证
//数据验证成功后，将本次请求流转给后面的路由处理函数
//验证失败后，则终止后续代码的执行，并抛出全局err错误，进入全局错误级别中间件中进行处理
router.post("/reguser", expressJoi(reg_login_schema), user_handler.regUser);

//登录
router.post("/login", expressJoi(reg_login_schema), user_handler.login);

module.exports = router;
