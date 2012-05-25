"use strict";
var util = require('./util');

exports.batch = util.makeVows('page-break-inside', {
	'avoid': {
		'tokens': ['IDENT'],
		'toString': 'avoid',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'auto inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'auto',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
