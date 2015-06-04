"use strict";
var util = require('./util');

exports.batch = util.makeVows('border-style', {
	'solid': {
		'tokens': ['IDENT'],
		'toString': 'solid',
		'unparsed': [],
		'warnings': []
	},
	'inherit': {
		'tokens': ['IDENT'],
		'toString': 'inherit',
		'unparsed': [],
		'warnings': ['css-minimum:2']
	},
	'invalidValue': {
		'tokens': ['IDENT'],
		'toString': null,
		'unparsed': ['IDENT'],
		'warnings': null
	},
    'solid none': {
        'tokens': ['IDENT', 'S', 'IDENT'],
        'toString': "solid none",
        'unparsed': [],
        'warnings': []
    },
    'solid none dotted': {
        'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT'],
        'toString': "solid none dotted",
        'unparsed': [],
        'warnings': []
    },
    'solid none dotted dashed': {
        'tokens': ['IDENT', 'S', 'IDENT', 'S', 'IDENT', 'S', 'IDENT'],
        'toString': "solid none dotted dashed",
        'unparsed': [],
        'warnings': []
    }
});
