const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { mongoDbUrl } = require('./config/database');

// Handlebar Helpers
const { select, generateDate, checkedIf, ifCond } = require('./helpers/handlebars-helpers');

// mongoose.Promise = global.Promise;
// Mongoose
mongoose
	.connect(mongoDbUrl)
	.then(() => {
		console.log('MongoDB Connected');
	})
	.catch(err => {
		console.log(err);
	});

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'home',
		helpers: { select: select, generateDate: generateDate, checkedIf: checkedIf, ifCond: ifCond }
	})
);
app.set('view engine', 'handlebars');

// Upload Middleware
app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

app.use(
	session({
		secret: 'sahil',
		resave: true,
		saveUninitialized: true
	})
);

// Flash
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Local varibales using Middleware
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	res.locals.success_message = req.flash('success_message');
	res.locals.error_message = req.flash('error_message');
	res.locals.error = req.flash('error');
	next();
});

// Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// Use Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

app.listen(5000, () => {
	console.log('server is listening at port: 5000');
});
