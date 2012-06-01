"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-family', {
	'wiggle': {
		'tokens': ['IDENT'],
		'toString': 'wiggle',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'one, two three, four': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT', 'S', 'IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'one, two three, four',
		'unparsed': [],
		'warnings': ['not-forward-compatible:3', 'css-minimum:2', 'css-unsupported:2.1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1', 'inherit-not-allowed']
	},
	'76px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
