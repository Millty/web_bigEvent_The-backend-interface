//导入express
const express = require("express");
//创建路由函数
const router = express.Router();

//导入解析formdata格式表单数据的包
const multer = require("multer");
//导入处理路径的核心模块
const path = require("path");

//创建multer实例
const uploads = multer({ dest: path.join(__dirname, "../uploads") });
//const upload = multer({ dest: process.cwd(__dirname, "../uploads") });
//导入文章的路由处理函数模块
const article_handler = require("../router_handler/article");

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
//导入文章的验证规则
const { add_article_schema } = require("../schema/article");

router.get("/list", article_handler.getArticle);

//发布新文章的路由，先使用了multer解析表单数据，再使用expressJoi对解析的表单数据进行验证
router.post(
  "/add",
  uploads.single("cover_img"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

module.exports = router;
