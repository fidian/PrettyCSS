"use strict";
var util = require('./util');

exports.batch = util.makeVows('ms-color-stop', {
	'blue': {
		'tokens': ['IDENT'],
		'toString': 'blue',
		'unparsed': [],
		'warnings': []
	},
	'red 0.1 inherit': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': 'red 0.1',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'red 1%': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'red 1%',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
