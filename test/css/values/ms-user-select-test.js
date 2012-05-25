"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-user-select', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': []
	},
	'auto inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'auto',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
