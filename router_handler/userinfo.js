//导入数据库操作模块
const db = require("../db/index");

const bcrypt = require("bcryptjs");

//获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  //定义查询用户信息的sql语句
  const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`;

  //调用query（）执行sql语句
  db.query(sql, req.user.id, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但查询到的数据不唯一
    if (results.length !== 1) return res.cc("获取用户信息是失败");
    //执行成功，将用户信息响应给客户端
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

//更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  //定义更新用户信息的sql语句
  const sql = `update ev_users set ? where id=?`;
  //调用db.query()执行sql语句并传递参数
  db.query(sql, [req.body, req.body.id], (err, results) => {
    //执行sql失败
    if (err) return res.cc(err);
    //执行成功但返回结果不唯一
    if (results.affectedRows !== 1) return res.cc("更新用户信息失败");
    //成功
    res.send({
      status: 0,
      message: "更新用户基本信息成功",
    });
  });
};

//重置密码的处理函数
exports.updatePassword = (req, res) => {
  //根据id查询用户信息
  const sql = `select * from ev_users where id=?`;
  //执行根据id查找用户信息的sql语句
  db.query(sql, req.user.id, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);

    if (results.length !== 1) return res.cc("用户不存在");

    //判断密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("旧密码错误");

    //定义更新密码的sql语句
    const sqlStr = `update ev_users set password=? where id=?`;
    //对新密码加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    //调用query执行sql
    db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);

      if (results.affectedRows == 0) return res.cc("qqq");
      if (results.affectedRows !== 1) return res.cc("更新密码失败！");

      res.send({
        status: 0,
        message: "重置密码成功",
      });
    });
  });

  //执行成功
};

//更改用户头像
exports.updateAvatar = (req, res) => {
  //更新头像的sql语句
  const sql = `update ev_users set user_pic=? where id=?`;

  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc("更改头像失败");

    res.send({
      status: 0,
      message: "更改头像成功",
    });
  });
};
