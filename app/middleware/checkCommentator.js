module.exports = (option, app) => {
  return async function checkCommentator(ctx, next) {
    const { commentator } = ctx.state.comment;
    if(commentator.toString() != ctx.state.user._id) {
        ctx.throw(403, '没有权限修改/删除该评论');
    }

    await next();
  }
}