"use strict";
var util = require('./util');

exports.batch = util.makeVows('rotatey', {
	'rotatey(10deg)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rotateY(10deg)',
		'unparsed': [],
		'warnings': []
	},
	'rotatey(10%)': {
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
