"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-timing-function-single', {
	'ease': {
		'tokens': ['IDENT'],
		'toString': 'ease',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'linear ease': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'linear',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'steps(4,end)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'steps(4, end)',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
