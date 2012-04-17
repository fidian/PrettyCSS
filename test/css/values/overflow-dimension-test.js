"use strict";
var util = require('./util');

exports.batch = util.makeVows('overflow-dimension', {
	'visible': {
		'tokens': ['IDENT'],
		'toString': 'visible',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'hidden auto': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'hidden',
		'unparsed': ['IDENT'],
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
