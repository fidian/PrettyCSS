"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-blink', {
	'blink': {
		'tokens': ['IDENT'],
		'toString': 'blink',
		'unparsed': [],
		'warnings': ['browser_unsupported_IE', 'browser_unsupported_Chrome', 'browser_unsupported_Safari'] 
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
