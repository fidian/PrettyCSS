"use strict";
var util = require('./util');

exports.batch = util.makeVows('table-layout', {
	'inherit testing': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': []
	},
	'1.0': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
