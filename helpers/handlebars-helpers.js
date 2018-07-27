const moment = require('moment');

module.exports = {
	select: function(selected, options) {
		return options.fn(this).replace(new RegExp(' value="' + selected + '"'), '$&selected="selected"');
	},
	generateDate: function(date, format) {
		return moment(date).format(format);
	},
	checkedIf: function(condition) {
		return condition === 'true' ? 'checked' : '';
	},
	ifCond: function(v1, v2, options) {
		if (v1 === v2) {
			console.log('v1', typeof v1);
			console.log('v2', typeof v2);
			return options.fn(this);
		}
		console.log('v1', v1);
		console.log('v2', v2);
		console.log('v1 in else', typeof v1);
		console.log('v2', typeof v2);
		return options.inverse(this);
	}
};
