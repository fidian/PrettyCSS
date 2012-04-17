"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline-color', {
	'invert': {
		'tokens': ['IDENT'],
		'toString': 'invert',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'blue green': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'blue',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
