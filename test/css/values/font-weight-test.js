"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-weight', {
	'200': {
		'tokens': ['UNIT'],
		'toString': '200',
		'unparsed': [],
		'warnings': []
	},
	'bolder 500': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'bolder',
		'unparsed': ['UNIT'],
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
