const jsonwebtoken = require('jsonwebtoken');

const Answer = require('../mongodb/answers');
const Question = require('../mongodb/questions');
const User = require('../mongodb/users');

const secret = require('../../secret');

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
  }

  async find() {
    const { ctx } = this;
    ctx.body = await User.find().select('+password');
  }

  async findById() {
    const { ctx } = this;
    // 字段过滤，使用 mongoose 的 select 方法
    //const { fields = '?fields=;'} = ctx.query;    // 预定义一个字符串
    const { fields = ''} = ctx.query;
    const selectFields = fields.split(';')
                              .filter(f => f)
                              .map(f => ' +' + f)
                              .join('');
    const user = await User.findById(ctx.params.id).select(selectFields);
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
  }

  async createUser() {
    const { ctx } = this;

    ctx.validate({     // egg 的参数校验
      name: 'string',
      password: 'string'
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({name});
    if (repeatedUser) { ctx.throw(409, '该用户名已注册'); }

    let user;
    try {
      user = await new User(ctx.request.body).save();
    } catch(err) {
      ctx.throw(500, '数据库同步失败');
    }
    ctx.body = user;
  }

  async update() {
    const { ctx } = this;
    ctx.validate({
      name: 'string?',
      password: 'string?',
      avatar_url: 'string?',
      gender: { 
        type: 'enum', values: ['male', 'famale'], allowEmpty: false 
      },
      headline: 'string?',
      locations: {
        type: 'array', values: {type: 'string?'}
      },
      business: 'string?',
      employments: {
        type: 'array', 
        values: {
          type: 'object', values: {company: 'string?', job:'string'}
        }
      }
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user;
    //console.log('用户信息修改成功');
  }

  async delete() {
    const { ctx } = this;
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) { ctx.throw(404, '用户不存在'); }
    console.log('删除成功');
    ctx.status = 204;
  }

  // 用户登陆接口
  async login() {
    const { ctx } = this;
    ctx.validate({     // 首先校验用户名和密码
      name: 'string',
      password: 'string'
    });

    const user = await User.findOne(ctx.request.body);
    if(!user) { ctx.throw(401, '用户名或密码错误'); }
    
    const { _id, name } = user;
    const token = jsonwebtoken.sign({_id, name}, secret, {expiresIn:'1d'})
    ;    // 签名里放置不敏感信息，密码要外设再导入
    //console.log(token);
    ctx.body = { token };
  }

  // 获取用户关注列表
  async listFollowing() {
    const { ctx } = this;
    const user = await User.findById(ctx.params.id)
                            .select('+following')
                            .populate('following');
                            // populate() 关联其他表的方法
    if(!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.following;
  }

  // 用户关注操作
  async follow() {
    const { ctx } = this;
    // 首先找到自己的数据存储结构
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      try {
        await me.save();
      } 
      catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
    }
    
    ctx.status = 204;
  }

  // 取关操作
  async unfollow() {
    const { ctx } = this;
    // 首先找到自己的数据存储结构
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following
                    .map(id => id.toString())
                    .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      try {
        await me.save();
      } catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
      
      console.log('取关成功');
    }
    
    ctx.status = 204;
  }

  // 获取用户粉丝列表
  async listFollowers() {
    const { ctx } = this;
    // 分页
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const users = await User.find({following: ctx.params.id})
                            .limit(perPage).skip(page*perPage);
    ctx.body = users;
  }

  // 用户关注话题操作
  async followTopic() {
    const { ctx } = this;
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id);
      try {
        await me.save();
      } catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
      console.log('关注话题成功');
    }
    
    ctx.status = 204;
  }

  // 取关话题操作
  async unfollowTopic() {
    const { ctx } = this;
    const me = await User.findById(ctx.state.user._id).select('+followingTopics');
    const index = me.followingTopics
                    .map(id => id.toString())
                    .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      try {
        await me.save();
      } catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
      
      console.log('取关话题成功');
    }
    
    ctx.status = 204;
  }

  // 获取用户关注的话题列表
  async listFollowingTopics() {
    const { ctx } = this;
    const user = await User.findById(ctx.params.id)
                            .select('+followingTopics')
                            .populate('followingTopics');
                            // populate() 关联其他表的方法
    if(!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.followingTopics;
  }

  // 获取话题的粉丝列表
  async listTopicFollowers() {
    const { ctx } = this;
    // 分页
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const users = await User.find({followingTopics: ctx.params.id})
                            .limit(perPage).skip(page*perPage);
    ctx.body = users;
  }

  // 用户的问题列表
  async listQuestions() {
    const { ctx } = this;

    const questions = await Question.find( 
      {questioner: ctx.params.id} );
    ctx.body = questions;
  }

  // 获取用户的点赞答案列表
  async listLikingAnswers() {
    const { ctx } = this;
    const { per_page = 5 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const user = await User.findById(ctx.params.id)
                            .select('likingAnswers')
                            .populate('likingAnswers')
                            .limit(perPage)
                            .skip(page*perPage);
    if(!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.likingAnswers;
  }

  // 用户点赞答案操作
  async like() {
    const { ctx } = this;
    const me = await User.findById(ctx.state.user._id).select('likingAnswers');

    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      try {
        await me.save();
        // 对答案的赞同数加一
        await Answer.findByIdAndUpdate(
          ctx.params.id, 
          { $inc: { voteCount: 1 } }
        );
        console.log('赞回答成功');
      } 
      catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
    }
    ctx.status = 204;
  }

  // 用户取消赞答案操作
  async unlike() {
    const { ctx } = this;
    const me = await User.findById(ctx.state.user._id).select('likingAnswers');
    const index = me.likingAnswers
                    .map(id => id.toString())
                    .indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      try {
        await me.save();
        // 对答案的赞数减一
        await Answer.findByIdAndUpdate(
          ctx.params.id, 
          { $inc: { voteCount: -1 } }
        );
        console.log('取消赞答案成功');
      } 
      catch(err) {
        ctx.throw(500, '数据库同步失败');
      }
    }
    ctx.status = 204;
  }
  // 获取用户的点踩答案列表
  // 用户踩操作
  // 用户取消踩操作
  // 踩和赞是互斥的，如何实现这种互斥操作？
  // 在赞后执行取消踩，在踩后执行取消赞，都变成中间件函数
}

module.exports = UserController;