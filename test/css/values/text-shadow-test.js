"use strict";
var util = require('./util');

exports.batch = util.makeVows('text-shadow', {
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'12px': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'12px 12px watermelon': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '12px 12px',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'12px 12px blue 12px': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT', 'S', 'UNIT'],
		'toString': '12px 12px blue',
		'unparsed': ['UNIT'],
		'warnings': ['minimum_css_version_3']
	},
	'blue 12px 1px 5px': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'blue 12px 1px 5px',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'12px 12px inherit': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '12px 12px inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'inherit_not_allowed']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
