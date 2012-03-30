"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'display-type';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	'block': util.testValue({
		'tokens': [ 'IDENT' ],
		'toString': 'block',
		'unparsed': [],
		'warnings': []
	}),
	'compact ': util.testValue({
		'tokens': [ 'IDENT', 'S' ],
		'toString': 'compact',
		'unparsed': [],
		'warnings': [ 'minimum_css_version_2', 'maximum_css_version_2', 'not_forward_compatible_2.1' ]
	}),
	'asdfjadfj': util.testValue({
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}),
	'table-footer-group': util.testValue({
		'tokens': ['IDENT'],
		'toString': 'table-footer-group',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	}),
	'inline-block': util.testValue({
		'tokens': ['IDENT'],
		'toString': 'inline-block',
		'unparsed': [],
		'warnings': ['minimum_css_version_2.1']
	}),
	'inherit': util.testValue({
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2', 'browser_unsupported_IE7', 'browser_quirk_IE8']
	})	
});
