"use strict";
var util = require('./util');

exports.batch = util.makeVows('list-style-position', {
	'inside': {
		'tokens': ['IDENT'],
		'toString': 'inside',
		'unparsed': [],
		'warnings': []
	},
	'outside': {
		'tokens': ['IDENT'],
		'toString': 'outside',
		'unparsed': [],
		'warnings': []
	},
	'hanging': {
		'tokens': ['IDENT'],
		'toString': 'hanging',
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
