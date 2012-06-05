"use strict";
var util = require('./util');

exports.batch = util.makeVows('angle', {
	'-10deg': {
		'tokens': ['UNIT'],
		'toString': '350deg',
		'unparsed': [],
		'warnings': ['angle']
	},
	'0deg': {
		'tokens': ['UNIT'],
		'toString': '0deg',
		'unparsed': [],
		'warnings': []
	},
	'1deg 2deg': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '1deg',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'359.99deg': {
		'tokens': ['UNIT'],
		'toString': '359.99deg',
		'unparsed': [],
		'warnings': []
	},
	'360deg': {
		'tokens': ['UNIT'],
		'toString': '0deg',
		'unparsed': [],
		'warnings': ['angle']
	},
	'380deg': {
		'tokens': ['UNIT'],
		'toString': '20deg',
		'unparsed': [],
		'warnings': ['angle']
	},
	'-40grad': {
		'tokens': ['UNIT'],
		'toString': '360grad',
		'unparsed': [],
		'warnings': ['angle']
	},
	'100grad': {
		'tokens': ['UNIT'],
		'toString': '100grad',
		'unparsed': [],
		'warnings': []
	},
	'420grad': {
		'tokens': ['UNIT'],
		'toString': '20grad',
		'unparsed': [],
		'warnings': ['angle']
	},
	'-40rad': {
		'tokens': ['UNIT'],
		'toString': '3.9822971503rad',
		'unparsed': [],
		'warnings': ['angle']
	},
	'2rad': {
		'tokens': ['UNIT'],
		'toString': '2rad',
		'unparsed': [],
		'warnings': []
	},
	'20rad': {
		'tokens': ['UNIT'],
		'toString': '1.1504440785rad',
		'unparsed': [],
		'warnings': ['angle']
	},
	'-6.3turn': {
		'tokens': ['UNIT'],
		'toString': '0.7turn',
		'unparsed': [],
		'warnings': ['angle']
	},
	'0.34turn': {
		'tokens': ['UNIT'],
		'toString': '0.34turn',
		'unparsed': [],
		'warnings': []
	},
	'20.1turn': {
		'tokens': ['UNIT'],
		'toString': '0.1turn',
		'unparsed': [],
		'warnings': ['angle']
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
