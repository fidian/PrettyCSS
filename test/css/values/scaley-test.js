"use strict";
var util = require('./util');

exports.batch = util.makeVows('scaley', {
	'scaley(10)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleY(10)',
		'unparsed': [],
		'warnings': []
	},
	'scaley(.105)': {
		'tokens': ['FUNCTION', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'scaleY(.105)',
		'unparsed': [],
		'warnings': []
	},
	'scaley(10%)': {
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
