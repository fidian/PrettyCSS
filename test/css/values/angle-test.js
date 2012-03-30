"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'angle';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	// Valid range is [ 0 - 360 )
	'0': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': []
	}),
	'359': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '359',
		'unparsed': [],
		'warnings': []
	}),
	'359.99999': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '359.99999',
		'unparsed': [],
		'warnings': []
	}),

	// Trim leading zeros
	'0000044': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '44',
		'unparsed': [],
		'warnings': []
	}),

	// Invalid
	'-12': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '348',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	}),
	'360': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	}),
	'722': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '2',
		'unparsed': [],
		'warnings': [ 'angle_between_0_and_360' ]
	}),

	// Not a valid input
	'ident': util.testValue({
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	})
});
