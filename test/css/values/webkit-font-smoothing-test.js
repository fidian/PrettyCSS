"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-font-smoothing', {
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'antialiased blah': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'antialiased',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
