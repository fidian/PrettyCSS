"use strict";
var util = require('./util');

exports.batch = util.makeVows('overflow-dimension', {
	'visible': {
		'tokens': ['IDENT'],
		'toString': 'visible',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'hidden auto': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'hidden',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
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
