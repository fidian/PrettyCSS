"use strict";
var util = require('./util');

exports.batch = util.makeVows('at-rule', {
	'charset': {
		'input': '@charset "UTF-8";\n',
		'tokenList': ['AT_SYMBOL', 'S', 'STRING', 'SEMICOLON'],
		'tokensRemaining': 1,
		'toString': '@charset "UTF-8";'
	},
	'charset-bad': {
		'input': '@charset\n',
		'tokenList': ['AT_SYMBOL', 'S'],
		'tokensRemaining': 0,
		'toString': '@charset '
	},
	'media': {
		'input': '@media print {\n\ta {\n\t\tdisplay: none;\n\t}\n}\n',
		"tokenList": ["AT_SYMBOL", "S", "IDENT", "S"],
		"tokensRemaining": 1,
		"toString": "@media print {a{display:none;}}"
	},
	'media-bad': {
		'input': '@media print {\n',
		"tokenList": ["AT_SYMBOL", "S", "IDENT", "S"],
		"tokensRemaining": 0,
		"toString": "@media print {}"
	}
});
