const Answer = require('../mongodb/answers');

module.exports = (option, app) => {
  return async function checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id)
                               .select('questionId answerer');
    if(!answer) { ctx.throw(404, '答案不存在'); }
    // 赞踩的路由中没有 questionId，需要对接下来的判断条件进行修改
    // 添加 ctx.params.questionId && ，有就是其他业务的路由
    if (ctx.params.questionId && answer.questionId != ctx.params.questionId) {
      ctx.throw(404, '该问题下答案不存在');
    }
    ctx.state.answer = answer;    

    await next();
  }
}