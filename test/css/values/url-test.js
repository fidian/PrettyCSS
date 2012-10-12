"use strict";
var util = require('./util');

exports.batch = util.makeVows('url', {
	'url( "asdf" )': {
		'tokens': ['URL'],
		'toString': 'url( "asdf" )',
		'unparsed': [],
		'warnings': []
	},
	'url(http://more.peanut.butter/)': {
		'tokens': ['URL'],
		'toString': 'url(http://more.peanut.butter/)',
		'unparsed': [],
		'warnings': []
	},
	'url(http://more.peanut.butter/)blah)': {
		'tokens': ['URL', 'IDENT', 'PAREN_CLOSE'],
		'toString': 'url(http://more.peanut.butter/)',
		'unparsed': ['IDENT', 'PAREN_CLOSE'],
		'warnings': []
	},
	'url ("blah")': {
		'tokens': ['IDENT', 'S', 'CHAR', 'STRING', 'PAREN_CLOSE'],
		'toString': null,
		'unparsed': ['IDENT', 'S', 'CHAR', 'STRING', 'PAREN_CLOSE'],
		'warnings': null
	},
	'url(/images/CaseMatters.png)': {
		'tokens': ['URL'],
		'toString': 'url(/images/CaseMatters.png)',
		'unparsed': [],
		'warnings': []
	},
	// inherit is not valid
	'inherit': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
