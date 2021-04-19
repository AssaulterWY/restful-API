const User = require('../mongodb/users');

module.exports = (option, app) => {
  return async function checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) { throw(404, '用户不存在'); }

    await next();
  }
}