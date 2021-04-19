const Comment = require('../mongodb/comments');

const Controller = require('egg').Controller;

class CommentController extends Controller {
	async find() {
		const { ctx } = this;
		const { per_page = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(per_page * 1, 1);
		const q = new RegExp(ctx.query.q);
		const { questionId, answerId } = ctx.params;
		// 希望显示二级评论的话，需要再接收根评论 ID 可有可无的参数在query里添加，在 populate 中还要关联 replyTo 属性
		const { rootCommentId } = ctx.query;

		ctx.body = await Comment
					.find({ content: q, questionId, answerId, rootCommentId })
					.limit(perPage).skip(page * perPage).populate('commentator replyTo');
	}

	async findById() {
		const { ctx } = this;
		const { fields = ''} = ctx.query;
		const selectFields = fields.split(';')
								   .filter(f => f)
								   .map(f => ' +' + f)
								   .join('');                         
		const comment = await Comment.findById(ctx.params.id)
					     .select(selectFields).populate('commentator');
		ctx.body = comment;
	}

	async createComment() {
		const { ctx } = this;
		ctx.validate({
			content: { type: 'string', required: true },
			rootCommentId: { type: 'string', required: false },
			replyTo: { type: 'string', required: false },
		});
		let comment;
		const { questionId, answerId } = ctx.params;
		try {
			comment = await new Comment(
				{...ctx.request.body, 
					commentator: ctx.state.user._id, 
					questionId,
					answerId
				}
			).save();
		} 
		catch(err) {
			ctx.throw(500, '数据库同步失败');
		}
		ctx.body = comment;
	}
	
	async update() {
		const { ctx } = this;
		ctx.validate({
				content: { type: 'string', required: true },
		});
		const { content } = ctx.request.body;
		try {
			await ctx.state.comment.updateOne({ content });
			ctx.body = ctx.state.comment;
			console.log('评论修改成功');
		} 
		catch(err) { throw(500, '评论修改失败'); }
	}
	
	async delete() {
		const { ctx } = this;
		await Comment.findByIdAndRemove(ctx.params.id);
		ctx.status = 204;
	}
}

module.exports = CommentController;
