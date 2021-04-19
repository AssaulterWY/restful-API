const Topic = require('../mongodb/topics');

module.exports = (option, app) => {
  return async function checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) { throw(404, '话题不存在，无法关注/取关'); }

    await next();
  }
}