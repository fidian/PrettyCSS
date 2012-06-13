"use strict";
var util = require('./util');

exports.batch = util.makeVows('scalex', {
	'scalex(10)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleX(10)',
		'unparsed': [],
		'warnings': []
	},
	'scalex(.105)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleX(.105)',
		'unparsed': [],
		'warnings': []
	},
	'scalex(10%)': {
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
