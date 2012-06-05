"use strict";
var util = require('./util');

exports.batch = util.makeVows('pseudoelement', {
	'pseudoclass': {
		'input': '::after\n',
		"errors": [],
		"tokenList": ["COLON", "COLON", "IDENT"],
		"tokensRemaining": 1,
		"toString": "::after"
	}
});
