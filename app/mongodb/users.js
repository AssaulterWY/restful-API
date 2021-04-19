const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

mongoose.connect(
    'mongodb://localhost:27017/test', 
    {useNewUrlParser: true, useUnifiedTopology: true}, 
    () => {
      console.log('MongoDB connect successfully !');
    }
);
mongoose.connection.on('error', console.error);

const { Schema, model } = mongoose;

// 用户名密码数据库设计和添加其他属性
// 数据库使用 select: false 进行字段隐藏，配合接口使用 select 方法进行字段过滤
const userSchema = new Schema({
  __v: { type: Number, select: false },

  name: { type: String, required: true }, 

  password: { type: String, required: true, select: false }, 

  avatar_url: { type: String },

  gender: {
    type: String, enum: ['male', 'famale'], require: true },

  headline: { type: String },

  locations: { type: [{ type: String }], select:false },  // 表示字符串数组

  business: { type: String, select:false },

  employments: {
    type: [{
      _id: {type:Number, select:false},
      company: { type: String },
      job: { type: String },
    }],
    select:false
  },

  educations: {
    type: [{
      _id: {type:Number, select:false},
      school: { type: String },
      major: { type: String },
      diploma: { type: Number, enum: [1, 2, 3, 4]},
      entrance_year: { type: Number },
      graduation_year: { type: Number },
    }],
    select:false
  },

  // 设计关注用户列表的属性
  following: {
    type: [{
       type: Schema.Types.ObjectId, ref: 'User'    // 重点是引用 User 集合
    }], 
    select: false
  },

  // 设计关注话题列表的属性
  followingTopics: {
    type: [{
       type: Schema.Types.ObjectId, ref: 'Topic'  
    }], 
    select: false
  },

  // 设计赞过的答案的列表属性
  likingAnswers: {
    type: [{
      type: Schema.Types.ObjectId, ref: 'Answer'
    }],
    select: false
  },

  dislikingAnswers: {
    type: [{
      type: Schema.Types.ObjectId, ref: 'Answer'
    }],
    select: false
  }


});

module.exports = model('User', userSchema);
