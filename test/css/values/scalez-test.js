"use strict";
var util = require('./util');

exports.batch = util.makeVows('scalez', {
	'scalez(10)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleZ(10)',
		'unparsed': [],
		'warnings': []
	},
	'scalez(.105)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleZ(.105)',
		'unparsed': [],
		'warnings': []
	},
	'scalez(10%)': {
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
