const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	title: {
		type: String,
		require: true
	},
	status: {
		type: String,
		require: true
	},
	allowComments: {
		type: Boolean,
		require: true
	},
	body: {
		type: String,
		require: true
	},
	file: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now()
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'category'
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'comment'
		}
	]
});

module.exports = mongoose.model('post', PostSchema);
