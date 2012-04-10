"use strict";
var util = require('./util');

exports.batch = util.makeVows('position', {
	'static': {
		'tokens': ['IDENT'],
		'toString': 'static',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'center': {
		'tokens': ['IDENT'],
		'toString': 'center',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'center akldjfakldj': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'center',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
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
