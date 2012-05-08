"use strict";
var util = require('./util');

exports.batch = util.makeVows('percentage', {
	'37%': {
		'tokens': ['UNIT'],
		'toString': '37%',
		'unparsed': [],
		'warnings': []
	},
	'13.%': {
		'tokens': ['UNIT'],
		'toString': '13.%',
		'unparsed': [],
		'warnings': []
	},
	'13.12%': {
		'tokens': ['UNIT'],
		'toString': '13.12%',
		'unparsed': [],
		'warnings': []
	},
	'.12%': {
		'tokens': ['UNIT'],
		'toString': '.12%',
		'unparsed': [],
		'warnings': []
	},
	'-12%': {
		'tokens': ['UNIT'],
		'toString': '-12%',
		'unparsed': [],
		'warnings': []
	},
	'110% inherit': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '110%',
		'unparsed': ['IDENT'],
		'warnings': []
	},
	// Inherit is not allowed for the basic type
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
