"use strict";
var util = require('./util');

exports.batch = util.makeVows('stylesheet', {
	'simple': {
		'input': '@charset "UTF-8";\n\na {\n\tbackground-color: blue;\n}\n\nbr {\n\tdisplay: none\n}\n',
		"tokenList": ["at-rule", "whitespace", "ruleset", "whitespace", "ruleset", "whitespace"],
		"tokensRemaining": 0,
		"toString": "@charset \"UTF-8\";a{background-color:blue;}br{display:none;}"
	},
	'bad at rule': {
		'input': '@charset "UTF-8"\n\na {\n\tbackground-color: blue;\n}\n\nbr {\n\tdisplay: none\n}\n',
		"tokenList": ["at-rule", "whitespace", "ruleset", "whitespace"],
		"tokensRemaining": 0,
		"toString": "@charset \"UTF-8\" a {\n\tbackground-color: blue;\n}br{display:none;}"
	}
});
