"use strict";
var util = require('./util');

exports.batch = util.makeVows('z-index', {
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'999.9': {
		'tokens': ['UNIT'],
		'toString': '999.9',
		'unparsed': [],
		'warnings': ['minimum_css_version_2', 'integer_value_required']
	},
	'-12 11': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '-12',
		'unparsed': ['UNIT'],
		'warnings': ['minimum_css_version_2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
