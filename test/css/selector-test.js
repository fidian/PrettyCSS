"use strict";
var util = require('./util');

exports.batch = util.makeVows('selector', {
	'single': {
		'input': 'a{}\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 3,
		"toString": "a"
	},
	'multiple': {
		'input': 'br,a, html > body\t,.blue:hover { rule: value }\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 24,
		"toString": "br"
	},
	'eof': {
		'input': 'br\n',
		"tokenList": ["IDENT"],
		"tokensRemaining": 0,
		"toString": "br"
	},
	'class': {
		'input': '.homeboy {}\n',
		"tokenList": ["CLASS", "S"],
		"tokensRemaining": 3,
		"toString": ".homeboy"
	},
	'combinator': {
		'input': 'a > .yellow:hover\n',
		"tokenList": ["IDENT", "COMBINATOR", "CLASS", "pseudoclass"],
		"tokensRemaining": 0,
		"toString": "a>.yellow:hover"
	},
	'combinator 2': {
		'input': 'p+div.colorful#blinking::after,span\n',
		"tokenList": ["IDENT", "COMBINATOR", "IDENT", "CLASS", "HASH", "pseudoelement"],
		"tokensRemaining": 3,
		"toString": "p+div.colorful#blinking::after"
	},
	'nth-child': {
		'input': 'tr:nth-child(odd) {}',
		'tokenList' : ['IDENT', 'pseudoclass', 'S'],
		'tokensRemaining': 2,
		'toString': 'tr:nth-child(odd)'
	},
	'error combinator': {
		'input': 'a > > html\n',
		'errors': ['illegal-token-after-combinator:COMBINATOR@1'],
		'name': 'invalid',
		"tokenList": ["IDENT", "COMBINATOR", "COMBINATOR", "S", "IDENT", "S"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'error combinator 2': {
		'input': 'p+>div\n',
		'errors': ['illegal-token-after-combinator:COMBINATOR@1'],
		'name': 'invalid',
		"tokenList": ["IDENT", "COMBINATOR", "COMBINATOR", "IDENT", "S"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'error colon colon ident': {
		'input': 'a :: after {}\n',
		'errors': ['ident-after-double-colon:COLON@1'],
		'name': 'invalid',
		"tokenList": ["IDENT", "S", "COLON", "COLON", "S", "IDENT", "S", "block"],
		"tokensRemaining": 1,
		"toString": ""
	},
	'error colon ident': {
		'input': 'a : hover { }\n',
		'errors': ['ident-after-colon:COLON@1'],
		'name': 'invalid',
		"tokenList": ["IDENT", "S", "COLON", "S", "IDENT", "S", "block"],
		"tokensRemaining": 1,
		"toString": ""
	}
});
