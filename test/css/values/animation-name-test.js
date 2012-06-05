"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-name', {
	'y': {
		'tokens': ['IDENT'],
		'toString': 'y',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'x y z': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'x',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'x, y, z': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'x, y, z',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'7px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
