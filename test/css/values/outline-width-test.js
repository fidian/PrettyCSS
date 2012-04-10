"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline-width', {
	'thin': {
		'tokens': ['IDENT'],
		'toString': 'thin',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'inherit thin': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'inherit',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
