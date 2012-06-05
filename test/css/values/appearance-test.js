"use strict";
var util = require('./util');

exports.batch = util.makeVows('appearance', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'menu field': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'menu',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
