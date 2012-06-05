"use strict";
var util = require('./util');

exports.batch = util.makeVows('whitespace', {
	'whitespace': {
		'input': '\n\t \n\n\t    \n',
		'errors': [],
		"tokenList": ["S"],
		"tokensRemaining": 0,
		"toString": ""
	}
});
