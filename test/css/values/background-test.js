"use strict";
var vows = require('vows');
var util = require('./util');

util.name = 'background';
util.obj = require('../../../lib/css/values/' + util.name);

exports.batch = vows.describe('lib/css/' + util.name + '.js').addBatch({
	// Test bg-layer value 
	'#fff': util.testValue({
		'tokens': ['HASH'],
		'toString': '#fff',
		'unparsed': [],
		'warnings': []
	}),
	'#fff, #000, #f00, blue': util.testValue({
		'tokens': ['HASH', 'OPERATOR', 'S', 'HASH', 'OPERATOR', 'S', 'HASH', 'OPERATOR', 'S', 'IDENT'],
		'toString': '#fff, #000, #f00, blue',
		'unparsed': [],
		'warnings': ['illegal_value', 'illegal_value', 'illegal_value']
	}),
	'url(a)': util.testValue({
		'tokens': ['URL'],
		'toString': 'url(a)',
		'unparsed': [],
		'warnings': []
	}),
	'url(a) alsjdjd': util.testValue({
		'tokens': ['URL','S', 'IDENT'],
		'toString': 'url(a)',
		'unparsed': ['IDENT'],
		'warnings': []
	})
});
