"use strict";
var util = require('./util');

exports.batch = util.makeVows('vertical-align', {
	'baseline': {
		'tokens': ['IDENT'],
		'toString': 'baseline',
		'unparsed': [],
		'warnings': []
	},
	'77%': {
		'tokens': ['UNIT'],
		'toString': '77%',
		'unparsed': [],
		'warnings': []
	},
	'44em inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '44em',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'use-script': {
		'tokens': ['IDENT'],
		'toString': 'use-script',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
