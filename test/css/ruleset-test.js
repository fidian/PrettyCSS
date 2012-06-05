"use strict";
var util = require('./util');

exports.batch = util.makeVows('ruleset', {
	'ruleset': {
		'input': 'a {}\n',
		"tokenList": [],
		"tokensRemaining": 1,
		"toString": "a{}"
	},
	'multiple selectors': {
		'input': 'br,a, html > body\t,.blue:hover { rule: value }\n',
		"tokenList": [],
		"tokensRemaining": 1,
		"toString": "br,a,html>body,.blue:hover{rule:value;}"
	},
	'no block': {
		'input': 'a b c',
		"errors": ["block-expected:IDENT@1"],
		'name': 'invalid',
		"tokenList": ["IDENT", "S", "IDENT", "S", "IDENT"],
		"tokensRemaining": 0,
		"toString": ""
	},
	'no close block': {
		'input': 'ul {\n\tproperty: value;\n',
		"tokenList": [],
		"tokensRemaining": 0,
		"toString": "ul{property:value;}"
	}
});
