"use strict";
var util = require('./util');

exports.batch = util.makeVows('position', {
	'static': {
		'tokens': ['IDENT'],
		'toString': 'static',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'center akldjfakldj': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'center',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
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
