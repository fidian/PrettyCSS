"use strict";
var util = require('./util');

exports.batch = util.makeVows('value', {
	'simple': {
		'input': 'none;\n',
		'errors': [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 1,
		"toString": "none"
	},
	'eob': {
		'input': '"times new roman"}\na {}\n',
		'errors': [],
		"tokenList": ["STRING"],
		"tokensRemaining": 7,
		"toString": "\"times new roman\""
	},
	'ws eof': {
		'input': '\nblue\n',
		'errors': [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "blue"
	}
});
