"use strict";
var util = require('./util');

exports.batch = util.makeVows('angle', {
	// Valid range is [ 0 - 360 )
	'0': {
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': []
	},
	'359': {
		'tokens': [ 'UNIT' ],
		'toString': '359',
		'unparsed': [],
		'warnings': []
	},
	'359.99999': {
		'tokens': [ 'UNIT' ],
		'toString': '359.99999',
		'unparsed': [],
		'warnings': []
	},

	// Trim leading zeros
	'0000044': {
		'tokens': [ 'UNIT' ],
		'toString': '44',
		'unparsed': [],
		'warnings': []
	},

	// Invalid
	'-12': {
		'tokens': [ 'UNIT' ],
		'toString': '348',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	},
	'360': {
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	},
	'722': {
		'tokens': [ 'UNIT' ],
		'toString': '2',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	},

	// Not a valid input
	'ident': {
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	}
});
