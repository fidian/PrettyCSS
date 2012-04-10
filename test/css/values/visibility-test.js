"use strict";
var util = require('./util');

exports.batch = util.makeVows('visibility', {
	'visible': {
		'tokens': ['IDENT'],
		'toString': 'visible',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'hidden inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'hidden',
		'unparsed': ['IDENT'],
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
