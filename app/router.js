const { EggApplication } = require("egg");

module.exports = app => {
    const { router, controller } = app;

    const auth = app.middleware.authentication();
    const checkOwner = app.middleware.checkOwner();
    const checkUserExist = app.middleware.checkUserExist();
    const checkTopicExist = app.middleware.checkTopicExist();
    const checkQuestionExist = app.middleware.checkQuestionExist();
    const checkQuestioner = app.middleware.checkQuestioner();
    const checkAnswerExist = app.middleware.checkAnswerExist();
    const checkAnswerer = app.middleware.checkAnswerer();
    const checkCommentExist = app.middleware.checkCommentExist();
    const checkCommentator = app.middleware.checkCommentator();
    
    router.get('/', controller.home.index);

    router.get('/user', controller.user.find);

    router.get('/user/:id', controller.user.findById);

    router.post('/user', controller.user.createUser);

    router.patch('/user/:id', auth, checkOwner, controller.user.update);

    router.delete('/user/:id', auth, checkOwner,controller.user.delete);

    // 用户登录
    router.post('/user/login', controller.user.login);
    
    // 上传图片
    //router.post('/upload', controller.home.upload);

    // 获取用户关注列表：嵌套资源的 API 路由设计
    router.get('/user/:id/following', controller.user.listFollowing);

    // 用户关注的路由设计
    router.put('/user/following/:id', auth, checkUserExist, controller.user.follow);
    // 取关
    router.delete('/user/following/:id', auth, checkUserExist, controller.user.unfollow);

    // 获取用户粉丝列表
    router.get('/user/:id/followers', controller.user.listFollowers);
    
    // 话题的路由
    router.get('/topic', controller.topic.find);

    router.get('/topic/:id', controller.topic.findById);

    router.post('/topic', auth, controller.topic.createTopic);

    router.patch('/topic/:id', auth, checkTopicExist, controller.topic.update);

    router.put('/topic/following/:id', auth, checkTopicExist, controller.user.followTopic);

    router.delete('/topic/following/:id', auth, checkTopicExist, controller.user.unfollowTopic);

    router.get('/user/:id/followingTopics', checkUserExist, controller.user.listFollowingTopics);

    router.get('/topic/:id/followers', checkTopicExist, controller.user.listTopicFollowers);

    // 问题的路由
    router.get('/question', controller.question.find);

    router.get('/question/:id', controller.question.findById);

    router.post('/question', auth, controller.question.createQuestion);

    router.patch('/question/:id', auth, checkQuestionExist, checkQuestioner, controller.question.update);

    router.delete('/question/:id', auth, checkQuestionExist, checkQuestioner, controller.question.delete);

    router.get('/user/:id/questions', controller.user.listQuestions);

    // 获取话题的问题列表路由设计
    router.get('/topic/:id/questions', checkTopicExist, controller.topic.listQuestions);

    // 答案路由设计
    router.get('/question/:questionId/answers/', controller.answer.find);

    router.get('/question/:questionId/answers/:id', controller.answer.findById);

    router.post('/question/:questionId/answers/', auth, controller.answer.createAnswer);

    router.patch('/question/:questionId/answers/:id', auth, checkAnswerExist, checkAnswerer, controller.answer.update);

    router.delete('/question/:questionId/answers/:id', auth, checkAnswerExist, checkAnswerer, controller.answer.delete);

    // 获取用户赞过的答案列表路由设计
    router.get('/user/:id/likingAnswers/', checkUserExist, controller.user.listLikingAnswers);

    // 用户赞答案操作
    router.get('/user/like/:id', auth, checkAnswerExist, controller.user.like);

    // 取消赞操作
    router.get('/user/unlike/:id', auth, checkAnswerExist, controller.user.unlike);

    // 设计评论的路由：三级嵌套
    // 查询某个问题下的某个回答下的所有评论
    router.get('/question/:questionId/answer/:answerId/comment', controller.comment.find);

    // 查询某个问题下的某个回答下的某个评论
    router.get('/question/:questionId/answer/:answerId/comment/:id', controller.comment.findById);

    // 增加一条某个问题下的某个回答下的评论
    router.post('/question/:questionId/answer/:answerId/comment/', auth, controller.comment.createComment);

    // 修改某个问题下的某个回答下的某条评论
    router.patch('/question/:questionId/answer/:answerId/comment/:id', auth, checkCommentExist, checkCommentator, controller.comment.update);

    // 删除某个问题下的某个回答下的某条评论
    router.delete('/question/:questionId/answer/:answerId/comment/:id', auth, checkCommentExist, checkCommentator, controller.comment.delete);
};