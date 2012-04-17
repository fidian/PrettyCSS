"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-blink', {
	'blink': {
		'tokens': ['IDENT'],
		'toString': 'blink',
		'unparsed': [],
		'warnings': ['browser-unsupported:ie', 'browser-unsupported:c', 'browser-unsupported:s'] 
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
