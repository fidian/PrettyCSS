"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-spacing', {
	'10px': {
		'tokens': ['UNIT'],
		'toString': '10px',
		'unparsed': [],
		'warnings': []
	},
	'10px 10px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '10px 10px',
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
