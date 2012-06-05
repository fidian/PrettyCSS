"use strict";
var util = require('./util');

exports.batch = util.makeVows('block', {
	'block': {
		'input': '{\n\tsome-property: some value("maybe");\n}\n',
		"tokenList": ["S", "IDENT", "COLON", "S", "IDENT", "S", "FUNCTION", "STRING", "PAREN_CLOSE", "SEMICOLON", "S"],
		"tokensRemaining": 1,
		"toString": "{\n\tsome-property: some value(\"maybe\");\n}"
	},
	'block-bad': {
		'input': '{\n',
		"name": "block",
		"tokenList": ["S"],
		"tokensRemaining": 0,
		"toString": "{\n}"
	},
	'nested': {
		'input': '{\n\tfont: black;\n\t{\n\t\tnested: yes;\n\t}\n\ttigger: {\n\t\tcat: true;\n\t}\n}\n',
		"tokenList": ["S", "IDENT", "COLON", "S", "IDENT", "SEMICOLON", "S", "BLOCK_OPEN", "S", "IDENT", "COLON", "S", "IDENT", "SEMICOLON", "S", "BLOCK_CLOSE", "S", "IDENT", "COLON", "S", "BLOCK_OPEN", "S", "IDENT", "COLON", "S", "IDENT", "SEMICOLON", "S", "BLOCK_CLOSE", "S"],
		"tokensRemaining": 1,
		"toString": "{\n\tfont: black;\n\t{\n\t\tnested: yes;\n\t}\n\ttigger: {\n\t\tcat: true;\n\t}\n}"
	},
	'nested-bad': {
		'input': '{\n\t{\n\t\tnested: yes;\n\t\tdisplay: hidden;\n}\n',
		"tokenList": ["S", "BLOCK_OPEN", "S", "IDENT", "COLON", "S", "IDENT", "SEMICOLON", "S", "IDENT", "COLON", "S", "IDENT", "SEMICOLON", "S", "BLOCK_CLOSE", "S"],
		"tokensRemaining": 0,
		"toString": "{\n\t{\n\t\tnested: yes;\n\t\tdisplay: hidden;\n}\n}"
	}
});
