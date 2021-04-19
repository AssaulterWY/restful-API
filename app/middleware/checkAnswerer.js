module.exports = (option, app) => {
  return async function checkAnswerer(ctx, next) {
    const { answerer } = ctx.state.answer;
    if(answerer.toString() != ctx.state.user._id) {
        ctx.throw(403, '没有权限修改/删除该答案');
    }

    await next();
  }
}