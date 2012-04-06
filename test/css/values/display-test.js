"use strict";
var util = require('./util');

exports.batch = util.makeVows('display', {
	'block': {
		'tokens': ['IDENT'],
		'toString': 'block',
		'unparsed': [],
		'warnings': []
	},
	'block "a"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'block "a"',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'"a" block': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"a" block',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'"a" blocker': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"a"',
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
