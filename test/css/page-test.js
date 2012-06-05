"use strict";
var util = require('./util');

exports.batch = util.makeVows('page', {
	'@page block': {
		'input': 'margin: 7em;\n',
		'tokenList': ['declaration-page', 'whitespace'],
		'tokensRemaining': 0,
		'toString': 'margin:7em;'
	}
});
