"use strict";
var util = require('./util');

exports.batch = util.makeVows('min-length', {
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'-10% blah': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '-10%',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_2', 'positive_value_required']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
