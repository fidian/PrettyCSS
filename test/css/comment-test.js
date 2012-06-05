"use strict";
var util = require('./util');

exports.batch = util.makeVows('comment', {
	'comment': {
		'input': '/* real comment */\na {}\n',
		"errors": [],
		"tokenList": ["COMMENT"],
		"tokensRemaining": 6,
		"toString": "/* real comment */"
	},
	'multi-line comment': {
		'input': '/* real\ncomment */\na {}\n',
		"errors": [],
		"tokenList": ["COMMENT"],
		"tokensRemaining": 6,
		"toString": "/* real\ncomment */"
	}
});
