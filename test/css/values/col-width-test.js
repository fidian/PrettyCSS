"use strict";
var util = require('./util');

exports.batch = util.makeVows('col-width', {
	'* mountain': {
		'tokens': ['CHAR', 'S', 'IDENT'],
		'toString': '*',
		'unparsed': ['IDENT'],
		'warnings': ['minimum_css_version_3']
	},
	'minmax(1em,2px)': {
		'tokens': ['FUNCTION', 'UNIT', 'OPERATOR', 'UNIT', 'PAREN_CLOSE'],
		'toString': 'minmax(1em, 2px)',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'7em': {
		'tokens': ['UNIT'],
		'toString': '7em',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'-7em': {
		'tokens': ['UNIT'],
		'toString': '-7em',
		'unparsed': [],
		'warnings': ['minimum_css_version_3', 'positive_value_required']
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
