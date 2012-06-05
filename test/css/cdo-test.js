"use strict";
var util = require('./util');

exports.batch = util.makeVows('cdo', {
	'cdo': {
		'input': '<!--\n\n',
		"tokenList": ["CDO"],
		"tokensRemaining": 1,
		"toString": "<!--"
	}
});
