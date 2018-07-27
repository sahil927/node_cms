const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.get('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

// Displaying only logged in user comments
router.get('/', (req, res) => {
	Comment.find({ user: '5b46f7bf91f10a13d4f73f9d' })
		.populate('user')
		.then(comments => {
			res.render('admin/comments', { comments: comments });
		});
});

router.post('/', (req, res) => {
	Post.findOne({ _id: req.body.id }).then(post => {
		const newComment = new Comment({
			user: req.user.id,
			body: req.body.body
		});

		post.comments.push(newComment);
		post.save().then(savedPost => {
			newComment.save().then(savedComment => {
				res.redirect(`/post/${post.id}`);
			});
		});
	});
});

router.delete('/:id', (req, res) => {
	Comment.findByIdAndRemove(req.params.id).then(deletedItem => {
		// After deleting comment
		// Deleting comment references in the Post documents
		Post.findOneAndUpdate({ comments: req.params.id }, { $pull: { comments: req.params.id } }, (err, data) => {
			if (err) console.log(err);
			res.redirect('/admin/comments');
		});
	});
});

router.post('/approve-comment', (req, res) => {
	console.log('approveComment', req.body.approveComment);
	const approveComment = req.body.approveComment;
	console.log('second approveComment', approveComment);
	Comment.findByIdAndUpdate(req.body.id, { $set: { approveComment: approveComment } }, (err, result) => {
		console.log('in server', result);
		if (err) return err;
		res.send(result);
	});
});
module.exports = router;
