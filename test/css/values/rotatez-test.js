"use strict";
var util = require('./util');

exports.batch = util.makeVows('rotatez', {
	'rotatez(10deg)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rotateZ(10deg)',
		'unparsed': [],
		'warnings': []
	},
	'rotatez(10%)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'warnings': null
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
