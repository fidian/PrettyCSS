"use strict";

var base = require('./base');
var util = require('../../util');

// Mapping properties to value types
var propertyMapping = {
	'margin': 'margin',
	'margin-bottom': 'margin-width',
	'margin-left': 'margin-width',
	'margin-right': 'margin-width',
	'margin-top': 'margin-width',
	'marks': 'page-marks',
	'orphans': 'widows-orphans',
	'page-break-after': 'page-break-edge',
	'page-break-before': 'page-break-edge',
	'page-break-inside': 'page-break-inside',
	'size': 'page-size',
	'widows': 'widows-orphans'
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-page"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);
