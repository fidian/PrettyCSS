// TODO:  Must specify font-family
// TODO:  Must specify src
// TODO:  inherit is not allowed

"use strict";

var base = require('./base');
var util = require('../../util');

// Mapping properties to value types
var propertyMapping = {
	'ascent': 'font-face-ascent',
	'baseline': 'font-face-baseline',
	'bbox': 'font-face-bbox',
	'cap-height': 'font-face-cap-height',
	'centerline': 'font-face-centerline',
	'definition-src': 'font-face-definition-src',
	'descent': 'font-face-descent',
	'font-family': 'font-face-font-family',
	'font-feature-settings': 'font-face-font-feature-settings',
	'font-size': 'font-face-font-size',
	'font-stretch': 'font-face-font-stretch',
	'font-style': 'font-face-font-style',
	'font-variant': 'font-face-font-variant',
	'font-weight': 'font-face-font-weight',
	'mathline': 'font-face-mathline',
	'panose-1': 'font-face-panose-1',
	'slope': 'font-face-slope',
	'src': 'font-face-src',
	'stemh': 'font-face-stemh',
	'stemv': 'font-face-stemv',
	'topline': 'font-face-topline',
	'unicode-range': 'font-face-unicode-range',
	'units-per-em': 'font-face-units-per-em',
	'widths': 'font-face-widths',
	'x-height': 'font-face-x-height'
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-font-face"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);
