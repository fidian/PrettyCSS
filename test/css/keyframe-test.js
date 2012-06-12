"use strict";
var util = require('./util');

exports.batch = util.makeVows('keyframe', {
	'one keyframe': {
		'input': 'from {top: 0px}\nto {top: 10px}\n',
		'tokenList': [],
		'tokensRemaining': 10,
		'toString': 'from{top:0;}'
	}
});
