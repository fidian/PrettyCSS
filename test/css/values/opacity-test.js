"use strict";
var util = require('./util');

exports.batch = util.makeVows('opacity', {
	'0.2': {
		'tokens': ['UNIT'],
		'toString': '0.2',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'0': {
		'tokens': ['UNIT'],
		'toString': '0',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'1 0': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1',
		'unparsed': ['UNIT'],
		'warnings': ['minimum_css_version_3']
	},
	'1.01': {
		'tokens': ['UNIT'],
		'toString': '1',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'out_of_range_max_1']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
