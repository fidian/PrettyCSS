"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-size', {
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
	'xx-small': {
		'tokens': ['IDENT'],
		'toString': 'xx-small',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'medium large': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'medium',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
