const Question = require('../mongodb/questions');

const Controller = require('egg').Controller;

class QuestionController extends Controller {
  async find() {
    const { ctx } = this;

    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    // 对问题的 title 或 description 进行模糊搜索，使用 mongoose 语法
    ctx.body = await Question.find({ $or: [{title: q}, {description: q}]})
                             .limit(perPage).skip(page * perPage);
  }

  async findById() {
    const { ctx } = this;
    const { fields = ''} = ctx.query;
    const selectFields = fields.split(';')
                               .filter(f => f)
                               .map(f => ' +' + f)
                               .join('');                         
    const question = await Question.findById(ctx.params.id)
                                   .select(selectFields)
                                   .populate('questioner topics');
    ctx.body = question;
  }

  async createQuestion() {
    const { ctx } = this;
    ctx.validate({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    });
    let question;
    try {
      question = await new Question(
        {...ctx.request.body, questioner: ctx.state.user._id}
        ).save();
    } catch(err) {
      ctx.throw(500, '数据库同步失败');
    }
    ctx.body = question;
  }

  async update() {
    const { ctx } = this;
    ctx.validate({
        title: { type: 'string', required: false },
        description: { type: 'string', required: false },
    });
    try {
      await ctx.state.question.updateOne(ctx.request.body);
      ctx.body = ctx.state.question;
      console.log('问题信息修改成功');
    } catch(err) { throw(500, '问题修改失败'); }
  }

  async delete() {
    const { ctx } = this;
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = QuestionController;
