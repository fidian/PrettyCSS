"use strict";
var util = require('./util');

exports.batch = util.makeVows('webkit-user-select', {
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': []
	},
	'none inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'none',
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
