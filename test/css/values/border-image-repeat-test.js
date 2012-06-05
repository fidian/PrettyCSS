"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image-repeat', {
	'repeat': {
		'tokens': ['IDENT'],
		'toString': 'repeat',
		'unparsed': [],
		'warnings': []
	},
	'stretch round': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'stretch round',
		'unparsed': [],
		'warnings': []
	},
	'stretch round repeat': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'stretch round',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit repeat': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
