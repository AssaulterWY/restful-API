const Answer = require('../mongodb/answers');

const Controller = require('egg').Controller;

class AnswerController extends Controller {
	async find() {
		const { ctx } = this;
		const { per_page = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(per_page * 1, 1);
		const q = new RegExp(ctx.query.q);
		ctx.body = await Answer
						.find({ content: q, AnswerId: ctx.params.AnswerId })
						.limit(perPage).skip(page * perPage);
	}

	async findById() {
		const { ctx } = this;
		const { fields = ''} = ctx.query;
		const selectFields = fields.split(';')
								   .filter(f => f)
								   .map(f => ' +' + f)
								   .join('');                         
		const answer = await Answer.findById(ctx.params.id)
					     .select(selectFields).populate('answerer');
		ctx.body = answer;
	}

	async createAnswer() {
		const { ctx } = this;
		ctx.validate({
			content: { type: 'string', required: true },
		});
		let answer;
		try {
			answer = await new Answer(
				{...ctx.request.body, 
					answerer: ctx.state.user._id, 
					questionId: ctx.params.questionId }
			).save();
		} catch(err) {
			ctx.throw(500, '数据库同步失败');
		}
		ctx.body = answer;
	}
	
	async update() {
    const { ctx } = this;
    ctx.validate({
			content: { type: 'string', required: true },
    });
    try {
      await ctx.state.answer.updateOne(ctx.request.body);
      ctx.body = ctx.state.answer;
      console.log('答案修改成功');
    } catch(err) { throw(500, '答案修改失败'); }
	}
	
	async delete() {
		const { ctx } = this;
		await Answer.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}
}

module.exports = AnswerController;
