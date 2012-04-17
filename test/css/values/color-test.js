"use strict";
var util = require('./util');

exports.batch = util.makeVows('color', {
	'inactiveborder': {
		'tokens': ['IDENT'],
		'toString': 'inactiveborder',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-deprecated:3', 'suggest-using:appearance']
	},
	'#fed': {
		'tokens': ['HASH'],
		'toString': '#fed',
		'unparsed': [],
		'warnings': []
	},
	'#f0f8ee': {
		'tokens': ['HASH'],
		'toString': '#f0f8ee',
		'unparsed': [],
		'warnings': []
	},
	'yellow': {
		'tokens': ['IDENT'],
		'toString': 'yellow',
		'unparsed': [],
		'warnings': []
	},
	'rgb(1, 2, 3)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'OPERATOR', 'S', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'rgb(1, 2, 3)',
		'unparsed': [],
		'warnings': []
	},
	'purple': {
		'tokens': ['IDENT'],
		'toString': 'purple',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'orange': {
		'tokens': ['IDENT'],
		'toString': 'orange',
		'unparsed': [],
		'warnings': ['css-minimum:2.1']
	},
	'transparent blah blah': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'transparent',
		'unparsed': ['IDENT', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'burlywood': {
		'tokens': ['IDENT'],
		'toString': 'burlywood',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	// No minimum css version here since it's part of CSS1
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
