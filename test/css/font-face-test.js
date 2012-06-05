"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face', {
	'font-face block': {
		'input': 'font-family: ghoulish;\n',
		'tokenList': ['declaration-font-face', 'whitespace'],
		'tokensRemaining': 0,
		'toString': 'font-family:ghoulish;'
	}
});
