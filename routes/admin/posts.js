const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty } = require('../../helpers/upload-helper');
const Category = require('../../models/Category');

const { userAuthenticated } = require('../../helpers/authentication');

// Layout Setup For Admin
router.get('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	Post.find({})
		.populate('category')
		.then(posts => {
			res.render('admin/posts/', { posts: posts });
		});
});

router.get('/my-posts', (req, res) => {
	Post.find({ user: req.user.id })
		.populate('category')
		.then(posts => {
			res.render('admin/posts/my-posts', { posts: posts });
		});
});

router.get('/create', (req, res) => {
	Category.find({}).then(categories => {
		res.render('admin/posts/create', { categories: categories });
	});
});

router.post('/create', (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({ message: 'please add a title' });
	}

	if (!req.body.body) {
		errors.push({ message: 'please add a description' });
	}

	if (errors.length > 0) {
		res.render('admin/posts/create', {
			errors: errors
		});
	} else {
		let filename = 'bmw.jpg';

		if (!isEmpty(req.files)) {
			let file = req.files.file;
			filename = Date.now() + '-' + file.name;

			file.mv('./public/uploads/' + filename, err => {
				if (err) throw err;
			});
		}

		let allowComments = true;

		if (req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}

		const newPost = new Post({
			user: req.user.id,
			title: req.body.title,
			status: req.body.status,
			allowComments: allowComments,
			body: req.body.body,
			category: req.body.category,
			file: filename
		});

		newPost.save().then(savedPost => {
			req.flash('success_message', `Post ${savedPost.title} was created successfully`);
			res.redirect('/admin/posts/');
		});
	}
});

router.get('/edit/:id', (req, res) => {
	Post.findOne({ _id: req.params.id }).then(post => {
		Category.find({}).then(categories => {
			console.log(post.allowComments);
			res.render('admin/posts/edit', { post: post, categories: categories });
		});
	});
});

router.put('/edit/:id', (req, res) => {
	Post.findOne({ _id: req.params.id }).then(post => {
		if (req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}
		post.user = req.user.id;
		post.title = req.body.title;
		post.status = req.body.status;
		post.allowComments = allowComments;
		post.body = req.body.body;
		post.category = req.body.category;

		if (!isEmpty(req.files)) {
			let file = req.files.file;
			filename = Date.now() + '-' + file.name;
			post.file = filename;

			file.mv('./public/uploads/' + filename, err => {
				if (err) throw err;
			});
		}

		post.save().then(updatedPost => {
			req.flash('success_message', `Post ${updatedPost.title} was updated successfully`);
			res.redirect('/admin/posts/my-posts');
		});
	});
});

router.delete('/:id', (req, res) => {
	Post.findOne({ _id: req.params.id })
		.populate('comments')
		.then(post => {
			// Deleting Post with comments
			if (!post.comments.length < 1) {
				post.comments.forEach(comment => {
					comment.remove();
				});
			}

			post.remove().then(postRemoved => {
				req.flash('success_message', `Post was successfully deleted`);
				res.redirect('/admin/posts/my-posts');
			});
		});
});

module.exports = router;
