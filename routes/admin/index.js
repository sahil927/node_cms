const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const { userAuthenticated } = require('../../helpers/authentication');

router.get('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', (req, res) => {
	res.render('admin/index');
});

router.get('/dashboard', (req, res) => {
	res.render('admin/dashboard');
});

router.post('/generate-fake-posts', (req, res) => {
	for (let i = 0; i < req.body.amount; i++) {
		let post = new Post();
		post.title = faker.name.title();
		post.status = faker.random.arrayElement(['public', 'private', 'draft']);
		post.allowComments = faker.random.boolean();
		post.body = faker.lorem.sentence();

		post.save().then(savedPost => {});
	}
	res.redirect('/admin/');
});
module.exports = router;
