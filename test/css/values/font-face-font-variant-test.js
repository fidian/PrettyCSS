"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-face-font-variant', {
	'normal': {
		'tokens': ['IDENT'],
		'toString': 'normal',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'small-caps inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'small-caps',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'small-caps, ruby': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'small-caps',
		'unparsed': ['OPERATOR', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'normal ruby historical-forms inherit': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'normal',
		'unparsed': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1']
	},
	'ruby historical-forms inherit': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'ruby historical-forms',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	// Parsed as a name
	'inherit': {
		'tokens': ['IDENT'],
		'toString': "inherit",
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-unsupported:2.1', 'inherit-not-allowed']
	},
	'87em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
