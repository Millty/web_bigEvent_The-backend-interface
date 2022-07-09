//导入数据库操作模块
const db = require("../db/index");

//导入bcryptjs
const bcrypt = require("bcryptjs");

//导入生成Token字符串的包
const jwt = require("jsonwebtoken");
//导入全局配置文件
const config = require("../config");
const { jwtSecretKey } = require("../config");

//注册处理函数
exports.regUser = (req, res) => {
  //获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  //对表单数据进行合法性校验
  if (!userinfo.username || !userinfo.password) {
    // return res.send({status:1 , message:'用户名密码不合法'})
    return res.cc("用户名密码不合法");
  }

  //定义sql语句，查询用户名是否被占用
  const sqlStr = `select * from ev_users where username=?`;
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      // return res.send({status:1, message:err.message})
      return res.cc(err);
    }
    //判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({
      //     status:1,
      //     message:'用户名被占用，请更换其他用户名'
      // })
      return res.cc("用户名被占用，请更换其他用户名");
    }
    //TODO：用户名可以使用
    //调用bcrypt.hashSync()对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    //定义插入新用户的sql语句
    const sql = "insert into ev_users set ?";
    //调用query执行sql语句
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        //判断sql语句是否执行成果
        if (err) {
          // return res.send({status:1,message:err.message})
          return res.cc(err);
        }
        //判断影响行数是否为1
        if (results.affectedRows !== 1)
          return res.cc("注册用户失败，请稍后重试");
        // return res.send({status:1,message:'注册用户失败，请稍后重试'})
        //注册用户成功
        // res.send({status:0,message:'注册成功'})
        res.cc("注册成功", 0);
      }
    );
  });
  //res.send("resuser ok");
};

//登录处理函数
exports.login = (req, res) => {
  //接收表单数据
  const userinfo = req.body;
  //定义sql语句
  const sql = `select * from ev_users where username=?`;
  //执行sql语句，根据用户名查询用户信息
  db.query(sql, userinfo.username, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但返回数据不止一条
    if (results.length !== 1) return res.cc("登陆失败");
    //判断密码是否正确
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc("登陆失败");

    //生成Token字符串
    const user = { ...results[0], password: "", user_pic: "" };

    //对用户信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });

    //调用res.send()将Token响应给客户端
    res.send({
      status: 0,
      message: "登录成功",
      token: "Bearer " + tokenStr,
    });

    //登陆成功
    //res.send("login ok");
  });
};
