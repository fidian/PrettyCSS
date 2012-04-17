"use strict";
var util = require('./util');

exports.batch = util.makeVows('bg-image', {
	'none inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'none',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'url(a)': {
		'tokens': ['URL'],
		'toString': 'url(a)',
		'unparsed': [],
		'warnings': []
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
