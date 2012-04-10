"use strict";
var util = require('./util');

exports.batch = util.makeVows('outline', {
	'10px': {
		'tokens': ['UNIT'],
		'toString': '10px',
		'unparsed': [],
		'warnings': []
	},
	'thin black thin': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'thin black',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'groove inherit': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'groove inherit',
		'unparsed': [],
		'warnings': ['inherit_not_allowed']
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
