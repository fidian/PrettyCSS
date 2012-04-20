// TODO:  Must specify font-family
// TODO:  Must specify src
// TODO:  inherit is not allowed

"use strict";

var base = require('./base');
var util = require('../../util');

// Mapping properties to value types
var propertyMapping = {
	'font-family': 'font-face-font-family',
	'font-style': 'font-face-font-style',
	'font-variant': 'font-face-font-variant'
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-fontface"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);
