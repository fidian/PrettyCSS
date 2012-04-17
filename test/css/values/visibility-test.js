"use strict";
var util = require('./util');

exports.batch = util.makeVows('visibility', {
	'visible': {
		'tokens': ['IDENT'],
		'toString': 'visible',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'hidden inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'hidden',
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
