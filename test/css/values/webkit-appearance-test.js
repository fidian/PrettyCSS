"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-appearance', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'scrollbarthumb-horizontal blue': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'scrollbarthumb-horizontal',
		'unparsed': ['IDENT'],
		'warnings': ['browser-unsupported:s4']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
