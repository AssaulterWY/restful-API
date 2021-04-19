module.exports = (option, app) => {
  return async function checkQuestioner(ctx, next) {
    const { questioner } = ctx.state.question;
    if(questioner.toString() != ctx.state.user._id) {
        ctx.throw(403, '没有权限修改/删除该问题');
    }

    await next();
  }
}