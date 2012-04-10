"use strict";
var util = require('./util');

exports.batch = util.makeVows('padding', {
	'20px': {
		'tokens': ['UNIT'],
		'toString': '20px',
		'unparsed': [],
		'warnings': []
	},
	'20px 20px 20px 20px': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '20px 20px 20px 20px',
		'unparsed': [],
		'warnings': []
	},
	'20px 20px ajdfklajdf': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '20px 20px',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	'20px inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '20px inherit',
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
