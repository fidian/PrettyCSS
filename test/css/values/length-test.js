"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'length';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	// 0 is valid without any unit
	'0': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': []
	}),

	// Should warn when the value of a unit is 0
	'0px': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '0',
		'unparsed': [],
		'warnings': [ 'no_unit_needed_on_zero_value', 'suggest_using_relative_units' ]
	}),

	// em and ex are relative units
	'6em': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '6em',
		'unparsed': [],
		'warnings': []
	}),
	'7.23ex': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '7.23ex',
		'unparsed': [],
		'warnings': []
	}),

	// Absolute units:  in cm mm pt pc px
	'99px': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '99px',
		'unparsed': [],
		'warnings': [ 'suggest_using_relative_units' ]
	}),

	// CSS3 units, all of which are relative:  ch rem vw vh vm
	'09090rem': util.testValue({
		'tokens': [ 'UNIT' ],
		'toString': '9090rem',
		'unparsed': [],
		'warnings': [ 'minimum_css_version_3' ]
	}),

	// Not a valid input
	'ident': util.testValue({
		'tokens': [ 'IDENT' ],
		'toString': null,
		'unparsed': [ 'IDENT' ],
		'warnings': null
	})
});
