//路由处理函数模块

//导入数据库操作模块
const db = require("../db/index");

//获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
  //定义查询分类列表数据的sql语句
  const sql = `select * from ev_article_cate where is_delete=0 order by id asc`;
  //调用query执行sql语句
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行成功
    res.send({
      status: 0,
      message: "获取文章分类列表成功",
      data: results,
    });
  });
};

//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  //定义查询别名与名称是否可用的sql语句
  const sql = `select * from ev_article_cate where name=? or alias=?`;

  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    //sql语句执行失败
    if (err) return res.cc(err);
    //判断数据的length
    if (results.length === 2)
      return res.cc("分类名称与分类别名被占用，请更换后重试");
    //length等于1的三种情况
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    )
      return res.cc("分类名称与分类别名被占用，请更换后重试");

    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc("分类名称被占用，请更换后重试");

    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc("分类别名被占用，请更换后重试");

    //定义插入文章分类的sql语句
    const sql = `insert into ev_article_cate set ?`;

    db.query(sql, req.body, (err, results) => {
      if (err) return res.cc(err);

      if (results.affectedRows !== 1) return res.cc("新增文章分类失败");

      res.send({
        status: 0,
        message: "新增文章分类成功",
      });
    });
  });
};

//删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  const sql = `update ev_article_cate set is_delete=1 where id=?`;

  db.query(sql, req.params.id, (err, results) => {
    if (err) res.cc(err);

    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");

    res.send({
      status: 0,
      message: "删除文章分类成功",
    });
  });
};

//根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`;

  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);

    if (results.length !== 1) return res.cc("获取文章分类信息失败");

    res.send({
      status: 0,
      message: "获取文章分类信息成功",
      data: results[0],
    });
  });
};

//更新文章分类的路由
exports.updateCateById = (req, res) => {
  //查询名称是否被占用的sql语句
  const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`;
  //执行sql语句
  db.query(
    sql,
    [req.body.id, req.body.name, req.body.alias],
    (err, results) => {
      //执行失败
      if (err) return res.cc(err);
      //名称 / 别名 被占用的情况
      if (results.length === 2) return res.cc("分类名称与别名被占用，请重试");
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      )
        return res.cc("分类名称与别名被占用，请重试");

      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名称被占用");
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用");

      //执行成功
      //更新文章分类
      const sql = `update ev_article_cate set ? where id=?`;

      db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);

        if (results.affectedRows !== 1) return res.cc("更新文章分类失败");

        res.send({
          status: 0,
          message: "更新文章分类成功",
        });
      });
    }
  );
};
