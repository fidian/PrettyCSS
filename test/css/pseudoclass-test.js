"use strict";
var util = require('./util');

exports.batch = util.makeVows('pseudoclass', {
	'pseudoclass': {
		'input': ':hover\n',
		"tokenList": ["COLON", "IDENT"],
		"tokensRemaining": 1,
		"toString": ":hover"
	}
});
