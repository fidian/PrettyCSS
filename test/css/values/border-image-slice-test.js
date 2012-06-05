"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-image-slice', {
	'12': {
		'tokens': ['UNIT'],
		'toString': '12',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'fill 12': {
		'tokens': ['IDENT', 'S', 'UNIT'],
		'toString': 'fill 12',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12 fill': {
		'tokens': ['UNIT', 'S', 'IDENT'],
		'toString': '12 fill',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'fill 12 fill': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': 'fill 12',
		'unparsed': ['IDENT'],
		'warnings': ['css-minimum:3']
	},
	'12 34%': {
		'tokens': ['UNIT', 'S', 'UNIT'],
		'toString': '12 34%',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12 34% 56': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '12 34% 56',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12 34% 56 78%': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '12 34% 56 78%',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12 34% 56 78% 9 fill': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '12 34% 56 78%',
		'unparsed': ['UNIT', 'S', 'IDENT'],
		'warnings': ['css-minimum:3']
	},
	'fill 12 34% 56 78% 9': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'fill 12 34% 56 78%',
		'unparsed': ['UNIT'],
		'warnings': ['css-minimum:3']
	},
	'12 34% fill 56 78%': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'IDENT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': '12 34% fill',
		'unparsed': ['UNIT', 'S', 'UNIT'],
		'warnings': ['css-minimum:3']
	},
	'12 34% 56 78% fill': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'IDENT'],
		'toString': '12 34% 56 78% fill',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'fill 12 34% 56 78%': {
		'tokens': ['IDENT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': 'fill 12 34% 56 78%',
		'unparsed': [],
		'warnings': ['css-minimum:3']
	},
	'12em 34% 56 78%': {
		'tokens': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'toString': null,
		'unparsed': ['UNIT', 'S', 'UNIT', 'S', 'UNIT', 'S', 'UNIT'],
		'warnings': null
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
