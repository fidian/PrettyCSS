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
		'warnings': ['minimum_css_version_2']
	},
	'url(http://www.cnn.com)': {
		'tokens': ['URL'],
		'toString': null,
		'unparsed': ['URL'],
		'warnings': null
	},
	'url(http://www.cnn.com),none': {
		'tokens': ['URL','OPERATOR','IDENT'],
		'toString': 'url(http://www.cnn.com) , none',
		'unparsed': [],
		'warnings': ['minimum_css_version_2']
	},
	'url(http://www.cnn.com/plate.jpg) 5 10, url(http://bestbuy.com/phone.jpg),none lightning': {
        	'tokens': ['URL', 'S', 'UNIT', 'S', 'UNIT', 'OPERATOR', 'S', 'URL', 'OPERATOR', 'IDENT', 'S', 'IDENT'] ,
        	'toString': 'url(http://www.cnn.com/plate.jpg) 5 10 , url(http://bestbuy.com/phone.jpg) , none',
        	'unparsed': ['IDENT'],
        	'warnings': ['minimum_css_version_3']
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
