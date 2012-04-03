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
		'toString': 'top right',
		'unparsed': [],
		'warnings': ['maximum_css_version_2.1', 'not_forward_compatible_3'],
	},
	'top left': {
		'tokens': ['IDENT', 'S', 'IDENT'],
                'toString': 'top left',
                'unparsed': [],
                'warnings': ['maximum_css_version_2.1', 'not_forward_compatible_3']
	},
	'center right': {
		'tokens': ['IDENT', 'S', 'IDENT'],
		'toString': 'center right',
		'unparsed': [],
		'warnings': ['maximum_css_version_2.1', 'not_forward_compatible_3']
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
