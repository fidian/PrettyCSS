"use strict";
var util = require('./util');

exports.batch = util.makeVows('number-percentage', {
	'0%': {
		'tokens': [ 'UNIT' ],
		'toString': '0%',
		'unparsed': [],
		'warnings': []
	},
	'0': {
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': []
	},
	'0 8': {
		'tokens': [ 'UNIT', 'S', 'UNIT' ],
		'toString': '0',
		'unparsed': ['UNIT'],
		'warnings': []
	},
	'0em': {
		'tokens': [ 'UNIT' ],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	}
});
