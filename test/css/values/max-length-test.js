"use strict";
var util = require('./util');

exports.batch = util.makeVows('max-length', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
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
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
