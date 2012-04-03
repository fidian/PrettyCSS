"use strict";
var util = require('./util');

exports.batch = util.makeVows('cursor-keyword', {
	'crosshair': {
		'tokens': ['IDENT'],
		'toString': 'crosshair',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'auto ': {
		'tokens': ['IDENT', 'S'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
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
