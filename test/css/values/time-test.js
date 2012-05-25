"use strict";
var util = require('./util');

exports.batch = util.makeVows('time', {
	// 0 is not valid
	'0': {
		'tokens': [ 'UNIT' ],
		'toString': null,
		'unparsed': ['UNIT'],
		'warnings': null
	},
	'0s': {
		'tokens': [ 'UNIT' ],
		'toString': '0s',
		'unparsed': [],
		'warnings': []
	},
	'-20ms 1s': {
		'tokens': [ 'UNIT', 'S', 'UNIT'],
		'toString': '-20ms',
		'unparsed': ['UNIT'],
		'warnings': []
	}
});
