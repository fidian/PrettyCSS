"use strict";
var util = require('./util');

exports.batch = util.makeVows('padding-width', {
	'24px': {
		'tokens': ['UNIT'],
		'toString': '24px',
		'unparsed': [],
		'warnings': []
	},
	'-24px': {
		'tokens': ['UNIT'],
		'toString': '-24px',
		'unparsed': [],
		'warnings': ['positive_value_required']
	},
	'50%': {
		'tokens': ['UNIT'],
		'toString': '50%',
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
