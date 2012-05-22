"use strict";
var util = require('./util');

exports.batch = util.makeVows('transition-timing-function-single', {
	'ease': {
		'tokens': ['IDENT'],
		'toString': 'ease',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'steps(1,end) inherit': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'IDENT', 'PAREN_CLOSE', 'S', 'IDENT'],
		'toString': 'steps(1, end)',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
