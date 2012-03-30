"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'attr';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	'attr(': util.testValue({
		'tokens': [ 'FUNCTION' ],
		'toString': null,
		'unparsed': [ 'FUNCTION' ],
		'warnings': null
	}),
	'attr(monkey': util.testValue({
		'tokens': [ 'FUNCTION', 'IDENT' ],
		'toString': null,
		'unparsed': [ 'FUNCTION', 'IDENT' ],
		'warnings': null
	}),
	'attr(monkey)': util.testValue({
		'tokens': [ 'FUNCTION', 'IDENT', 'PAREN_CLOSE' ],
		'toString': 'attr(monkey)',
		'unparsed': [],
		'warnings': []
	}),
	'attr( monkey ) banana': util.testValue({
		'tokens': [ 'FUNCTION', 'S', 'IDENT', 'S', 'PAREN_CLOSE', 'S', 'IDENT' ],
		'toString': 'attr(monkey)',
		'unparsed': ['IDENT'],
		'warnings': []
	}),
	'attr("monkey")': util.testValue({
		'tokens': [ 'FUNCTION', 'STRING', 'PAREN_CLOSE' ],
		'toString': null,
		'unparsed': [ 'FUNCTION', 'STRING', 'PAREN_CLOSE' ],
		'warnings': []
	}),

	// Invalid
	'-12': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': null,
		'unparsed': [ 'UNIT' ],
		'warnings': []
	})
});
