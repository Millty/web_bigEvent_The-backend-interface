const db = require("../db/index");

const { path } = require("@hapi/joi/lib/errors");
const { result } = require("@hapi/joi/lib/base");
//导入解析formdata格式表单数据的包
const multer = require("multer");
//导入处理路径的核心模块
const paths = require("path");
//创建multer实例
const uploads = multer({ dest: paths.join(__dirname, "../uploads") });

exports.getArticle = (req, res) => {
  const sql = `select * from ev_articles where is_delete=0 order by id asc`;

  db.query(sql, (err, results) => {
    if (err) return res.cc(err);

    res.send({
      status: 0,
      message: "获取文章列表成功",
      data: results,
    });
  });
};

//发布文章的处理函数
exports.addArticle = (req, res) => {
  //判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数");

  //处理文章信息对象
  const articleInfo = {
    //标题、内容、状态、所属的分类id
    ...req.body,
    //文章封面在服务器端的存放路径
    cover_img: paths.join("/uploads", req.file.filename),
    //文章的发布时间
    pub_data: new Date(),
    //文章作者的id
    author_id: req.user.id,
  };

  //定义发布文章的sql语句
  const sql = `insert into ev_articles set ?`;

  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc("发布文章失败");

    res.send({
      status: 0,
      message: "发布文章成功",
    });
  });

  //
};
