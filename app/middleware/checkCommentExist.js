const Comment = require('../mongodb/comments');

module.exports = (option, app) => {
  return async function checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id)
                               .select('commentator questionId answerId');
    if(!comment) { ctx.throw(404, '评论不存在'); }
    // 赞踩的路由中没有 questionId，需要对接下来的判断条件进行修改
    // 添加 ctx.params.questionId && ，有就是其他业务的路由
    if (ctx.params.questionId && comment.questionId != ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此评论');
    }
    if (ctx.params.answerId && comment.answerId != ctx.params.answerId) {
      ctx.throw(404, '该答案下没有此评论');
    }
    ctx.state.comment = comment;    

    await next();
  }
}