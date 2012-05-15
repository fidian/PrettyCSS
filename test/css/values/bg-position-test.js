"use strict";


var util = require('./util');

exports.batch = util.makeVows('bg-position', {
	'top': {
		'tokens': ['IDENT'],
		'toString': 'top',
		'unparsed': [],
		'warnings': []
	},
	'top right': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'right top',
		'unparsed': [],
		'warnings': [
			'autocorrect-swap'
		]
	},
	'top left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'left top',
		'unparsed': [],
		'warnings': [
			'autocorrect-swap'
		]
	},
	'center right': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'right center',
		'unparsed': [],
		'warnings': [
			'autocorrect-swap'
		]
	},
	'center': {
		'tokens': ['IDENT'],
                'toString': 'center',
                'unparsed': [],
                'warnings': []
	},
	'bottom': {
		'tokens': ['IDENT'],	
		'toString': 'bottom',
		'unparsed': [],
		'warnings': []
	},
	'50% 50%': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '50% 50%',
		'unparsed': [],
		'warnings': []
	},
	'40px 100px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': ['40px 100px'],
		'unparsed': [],
		'warnings': []
	},	
	'50% 100px': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '50% 100px',
		'unparsed': [],
		'warnings': []
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
                'unparsed': ['IDENT'],
                'warnings': []
	}
	
});
