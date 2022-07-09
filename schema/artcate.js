//导入定义验证规则的模块
const joi = require("joi");

//定义name和alias的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

//id的检验规则
const id = joi.number().integer().min(1).required();

//向外共享验证规则对象-新增分类
exports.add_cates_schema = {
  body: {
    name,
    alias,
  },
};

//验证规则对象-删除分类
exports.delete_cate_schema = {
  params: {
    id,
  },
};
//根据id获取文章分类信息
exports.get_cate_schema = {
  params: {
    id,
  },
};

//根据id更新文章分类信息的验证规则
exports.update_cate_schema = {
  body: {
    id,
    name,
    alias,
  },
};
