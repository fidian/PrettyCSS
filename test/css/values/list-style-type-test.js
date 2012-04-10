"use strict";
var util = require('./util');

exports.batch = util.makeVows('list-style-type', {
	'disc': {
		'tokens': ['IDENT'],
		'toString': 'disc',
		'unparsed': [],
		'warnings': []
	},
	'lower-latin': {
		'tokens': ['IDENT'],
		'toString': 'lower-latin',
		'unparsed': [],
		'warnings': ['minimum_css_version_2', 'maximum_css_version_2.1']
	},
	'arabic-indic': {
		'tokens': ['IDENT'],
		'toString': 'arabic-indic',
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
