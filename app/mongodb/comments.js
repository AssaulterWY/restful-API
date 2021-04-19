const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true},
    commentator: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      //select: false 
    },
    // 一个问题对应多个回答，一个回答对应多个一级评论
    questionId: { type: String, required: true },
    answerId: { type: String, required: true },
    // 一个一级评论还可以有二级评论，二级评论要有两个属性，根评论和回复给谁
    rootCommentId: { type: String, required: false },
    replyTo: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
}, {timestamps: true});    // 添加时间戳

module.exports = model('Comment', commentSchema);