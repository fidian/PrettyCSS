"use strict";
var util = require('./util');

exports.batch = util.makeVows('box-shadow', {
	'inset 8px 8px 8px 8px' : {
		'tokens': ['IDENT','S','UNIT','S','UNIT','S','UNIT','S','UNIT'],
		'toString': 'inset 8px 8px 8px 8px',
		'unparsed': [],
		'warnings':['css-minimum:3']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
