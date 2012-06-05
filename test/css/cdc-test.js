"use strict";
var util = require('./util');

exports.batch = util.makeVows('cdc', {
	'cdc': {
		'input': '-->\n\n',
		"tokenList": ["CDC"],
		"tokensRemaining": 1,
		"toString": "-->"
	}
});
