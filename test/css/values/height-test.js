"use strict";
var util = require('./util');

exports.batch = util.makeVows('height', {
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': []
	},
	'-7em': {
		'tokens': ['UNIT'],
		'toString': '-7em',
		'unparsed': [],
		'warnings': ['positive_value_required']
	},
	'auto': {
		'tokens': ['IDENT'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': []
	},
	'15%': {
		'tokens': ['UNIT'],
		'toString': '15%',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'-15%': {
		'tokens': ['UNIT'],
		'toString': '-15%',
		'unparsed': [],
		'warnings': ['minimum_css_version_2', 'positive_value_required']
	},
	'10px inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '10px',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2.1']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
