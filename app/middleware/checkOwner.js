module.exports = (options, app) => {
  return async function checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) 
      ctx.throw(403, '用户未授权');
    
    //console.log('有权限进行操作');
    await next();
  }
};