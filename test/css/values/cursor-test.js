"use strict";
var util = require('./util');

exports.batch = util.makeVows('cursor', {
	'crosshair': {
		'tokens': ['IDENT'],
		'toString': 'crosshair',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'auto ': {
		'tokens': ['IDENT', 'S'],
		'toString': 'auto',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'none': {
		'tokens': ['IDENT'],
		'toString': 'none',
		'unparsed': [],
		'warnings': ['minimum_css_version_3']
	},
	'url(http://www.cnn.com)': {
		'tokens': ['URL'],
		'toString': 'url(http://www.cnn.com)',
		'unparsed': [],
		'warnings': []
	},
	'url(http://www.cnn.com/plate.jpg) url(http:/bestbuy.com/phone.jpg)': {
        	'tokens': ['URL', 'S', 'URL'] ,
        	'toString': 'url(http://www.cnn.com/plate.jpg) url(http:/bestbuy.com/phone.jpg)',
        	'unparsed': [],
        	'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	}
});
