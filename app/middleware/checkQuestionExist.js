const Question = require('../mongodb/questions');

module.exports = (option, app) => {
  return async function checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id)
                                   .select('questioner');
    if(!question) { ctx.throw(404, '问题不存在'); }
    ctx.state.question = question;    // 添加一条属性可以避免重复查找

    await next();
  }
}