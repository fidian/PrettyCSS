"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image-width-single', {
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'1em inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '1em',
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
