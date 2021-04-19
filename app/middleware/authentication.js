const jsonwebtoken = require('jsonwebtoken');

const secret = 'dfasfs';

module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const { authorization = '' } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    
    try {
      const user = jsonwebtoken.verify(token, secret);
      //console.log(user);
      ctx.state.user = user;
    }
    catch(err) {
      ctx.throw(401, '认证失败');
    }
    //console.log('认证成功');
    
    await next();
  }
};