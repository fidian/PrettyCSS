"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image-repeat-single', {
	'repeat': {
		'tokens': ['IDENT'],
		'toString': 'repeat',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'stretch round': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'stretch',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
