"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-east-asian-width-values', {
	'full-width': {
		'tokens': ['IDENT'],
		'toString': 'full-width',
		'unparsed': [],
		'warnings': []
	},
	'proportional-width inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'proportional-width',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
