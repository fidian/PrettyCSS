"use strict";
var util = require('./util');

exports.batch = util.makeVows('selector', {
	'single': {
		'input': 'a{}\n',
		'errors': [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "a"
	},
	'multiple': {
		'input': 'br,a, html > body\t,.blue:hover { rule: value }\n',
		'errors': [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 24,
		"toString": "br"
	},
	'eof': {
		'input': 'br\n',
		'errors': [],
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "br"
	},
	'class': {
		'input': '.homeboy {}\n',
		'errors': [],
		"tokenList": ["CLASS", "S"],
		"tokensRemaining": 3,
		"toString": ".homeboy"
	},
	'combinator': {
		'input': 'a > .yellow:hover\n',
		'errors': [],
		"tokenList": ["IDENT", "COMBINATOR", "CLASS", "pseudoclass"],
		"tokensRemaining": 0,
		"toString": "a>.yellow:hover"
	},
	'combinator 2': {
		'input': 'p+div.colorful#blinking::after,span\n',
		'errors': [],
		"tokenList": ["IDENT", "COMBINATOR", "IDENT", "CLASS", "HASH", "pseudoelement"],
		"tokensRemaining": 3,
		"toString": "p+div.colorful#blinking::after"
	},
	'error combinator': {
		'input': 'a > > html\n',
		'errors': ['illegal-token-after-combinator:COMBINATOR@1'],
		"tokenList": ["IDENT", "COMBINATOR", "COMBINATOR", "S", "IDENT", "S"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'error combinator 2': {
		'input': 'p+>div\n',
		'errors': ['illegal-token-after-combinator:COMBINATOR@1'],
		"tokenList": ["IDENT", "COMBINATOR", "COMBINATOR", "IDENT", "S"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'error colon colon ident': {
		'input': 'a :: after {}\n',
		'errors': ['ident-after-double-colon:COLON@1'],
		"tokenList": ["IDENT", "S", "COLON", "COLON", "S", "IDENT", "S", "block"],
		"tokensRemaining": 1,
		"toString": ""
	},
	'error colon ident': {
		'input': 'a : hover { }\n',
		'errors': ['ident-after-colon:COLON@1'],
		"tokenList": ["IDENT", "S", "COLON", "S", "IDENT", "S", "block"],
		"tokensRemaining": 1,
		"toString": ""
	}
});
