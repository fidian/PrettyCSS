"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-decoration-color', {
	'#f00': {
		'tokens': ['HASH'],
		'toString': '#f00',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'red': {
		'tokens': ['IDENT'],
		'toString': 'red',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'red blue': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'red',
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
