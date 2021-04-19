const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const answerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true},
    answerer: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      //select: false 
    },
    // 问题的每一个回答只能对应于该问题的 ID 这样就实现了一对多的关系
    questionId: { type: String, required: true },
    // 点赞的投票属性，初始值设为 0
    voteCount: { type: Number, required: true, default: 0 }
});

module.exports = model('Answer', answerSchema);