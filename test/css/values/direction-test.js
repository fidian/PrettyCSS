"use strict";
var util = require('./util');

exports.batch = util.makeVows('direction', {
	'ltr': {
		'tokens': ['IDENT'],
		'toString': 'ltr',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'rtl inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'rtl',
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
