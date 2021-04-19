const Question = require('../mongodb/questions');

const Topic = require('../mongodb/topics');

const Controller = require('egg').Controller;

class TopicController extends Controller {
  async find() {
    const { ctx } = this;
    // 实现分页逻辑
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;    // 字符串转成数字，指当前是第几页
    const perPage = Math.max(per_page * 1, 1);  // 字符串转成数字，指每页显示多少项
    // 实现模糊搜索：把搜索关键字转换成正则表达式即可
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
                          .limit(perPage).skip(page*perPage);
    
  }

  async findById() {
    const { ctx } = this;
    //const { fields = '?fields=;'} = ctx.query;    // 预定义一个字符串
    const { fields = ''} = ctx.query;
    const selectFields = fields.split(';')
                               .filter(f => f)
                               .map(f => ' +' + f)
                               .join('');                         
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    if (!topic) { ctx.throw(404, '话题不存在'); }
    ctx.body = topic;
  }

  async createTopic() {
    const { ctx } = this;
    ctx.validate({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const { name } = ctx.request.body;
    const repeatedTopic = await Topic.findOne({name});
    if (repeatedTopic) { ctx.throw(409, '该话题已存在'); }

    let topic;
    try {
      topic = await new Topic(ctx.request.body).save();
    } catch(err) {
      ctx.throw(500, '数据库同步失败');
    }
    ctx.body = topic;
  }

  async update() {
    const { ctx } = this;
    ctx.validate({
        name: { type: 'string', required: false },
        avatar_url: { type: 'string', required: false },
        introduction: { type: 'string', required: false },
    });
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!topic) { ctx.throw(404, '话题不存在'); }
    ctx.body = topic;
    console.log('话题信息修改成功');
  }

  // 获取话题的问题列表
  async listQuestions() {
    const { ctx } = this;
    const questions = await Question.find({topics: ctx.params.id});
    ctx.body = questions;
  }

}

module.exports = TopicController;
