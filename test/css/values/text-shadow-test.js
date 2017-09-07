"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-shadow', {
	'blue 12px 1px 5px, blue 12px 1px 5px': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'OPERATOR', 'S', 'IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'blue 12px 1px 5px, blue 12px 1px 5px',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
