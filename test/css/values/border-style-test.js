"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-style', {
	'solid': {
		'tokens': ['IDENT'],
		'toString': 'solid',
		'unparsed': [],
		'warnings': []
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
