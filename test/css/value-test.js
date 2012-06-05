"use strict";
var util = require('./util');

exports.batch = util.makeVows('value', {
	'simple': {
		'input': 'none;\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 1,
		"toString": "none"
	},
	'eob': {
		'input': '"times new roman"}\na {}\n',
		"tokenList": ["STRING"],
		"tokensRemaining": 7,
		"toString": "\"times new roman\""
	},
	'ws eof': {
		'input': '\nblue\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "blue"
	}
});
