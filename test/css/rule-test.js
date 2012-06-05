"use strict";
var util = require('./util');

exports.batch = util.makeVows('rule', {
	'rule block': {
		'input': 'animation-name: yuy;\n',
		'tokenList': ['declaration-rule', 'whitespace'],
		'tokensRemaining': 0,
		'toString': 'animation-name:yuy;'
	}
});
