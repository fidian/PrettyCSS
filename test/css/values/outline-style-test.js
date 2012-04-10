"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline-style', {
	'groove': {
		'tokens': ['IDENT'],
		'toString': 'groove',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'dotted groove': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'dotted',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_2']
	},
	'groove inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'groove',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_2']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
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
