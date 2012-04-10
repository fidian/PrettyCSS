"use strict";
var util = require('./util');

exports.batch = util.makeVows('font-family', {
	'Times': {
		'tokens': ['IDENT'],
		'toString': 'Times',
		'unparsed': [],
		'warnings': ['font_family_one_generic_at_end']
	},
	'Times New Roman': {
		'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
		'toString': 'Times New Roman',
		'unparsed': [],
		'warnings': ['font_family_one_generic_at_end']
	},
	'serif, "Times New Roman"': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'STRING'],
		'toString': 'serif, "Times New Roman"',
		'unparsed': [],
		'warnings': ['font_family_one_generic_at_end']
	},
	'"Times New Roman", serif': {
		'tokens': ['STRING', 'OPERATOR', 'S', 'IDENT'],
		'toString': '"Times New Roman", serif',
		'unparsed': [],
		'warnings': []
	},
	'serif "Times New Roman"': {
		'tokens': ['IDENT', 'S', 'STRING'],
		'toString': 'serif',
		'unparsed': ['STRING'],
		'warnings': []
	},
	'"Times New Roman" serif': {
		'tokens': ['STRING', 'S', 'IDENT'],
		'toString': '"Times New Roman"',
		'unparsed': ['IDENT'],
		'warnings': ['font_family_one_generic_at_end']
	},
	'valid, inherit': {
		'tokens': ['IDENT', 'OPERATOR', 'S', 'IDENT'],
		'toString': 'valid, inherit',
		'unparsed': [],
		'warnings': ['font_family_one_generic_at_end', 'inherit_not_allowed']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'76em': {
		'tokens': ['UNIT'],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
