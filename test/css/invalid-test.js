"use strict";
var util = require('./util');

exports.batch = util.makeVows('invalid', {
	'semicolon': {
		'input': 'Gobble this up;\n',
		"errors": ["invalid-token:IDENT@1"],
		'name': 'invalid',
		"tokenList": ["IDENT", "S", "IDENT", "S", "IDENT", "SEMICOLON"],
		"tokensRemaining": 1,
		"toString": ""
	},
	'close block': {
		'input': '8.365}"it should keep eating up this"\n',
		"errors": ["invalid-token:UNIT@1"],
		"tokenList": ["UNIT", "BLOCK_CLOSE", "STRING", "S"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'with block': {
		'input': 'something { invalid; }\nIdent\n',
		"errors": ["invalid-token:IDENT@1"],
		"tokenList": ["IDENT", "S", "block"],
		"tokensRemaining": 3,
		"toString": ""
	}
});
