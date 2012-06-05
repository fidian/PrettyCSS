"use strict";
var util = require('./util');

exports.batch = util.makeVows('animation-fill-mode-single', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'forwards backwards': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'forwards',
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
