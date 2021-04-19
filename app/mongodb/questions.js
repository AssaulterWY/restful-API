const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true},
    description: { type: String },
    questioner: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      //select: false 
    },
    
    // 设计问题的话题属性（问题的话题列表一般不多，但是话题下的问题是成千上万的
    topics: {
      type: [{type: Schema.Types.ObjectId, ref: 'Topic', required: false}],
      select: false
    }
});

module.exports = model('Question', questionSchema);