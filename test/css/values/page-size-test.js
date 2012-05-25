"use strict";
var util = require('./util');

exports.batch = util.makeVows('page-size', {
	'8.5in': {
		'tokens': ['UNIT'],
		'toString': '8.5in',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:2.1']
	},
	'5cm 8cm 9cm': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '5cm 8cm',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:2.1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2', 'css-maximum:2', 'not-forward-compatible:2.1']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
