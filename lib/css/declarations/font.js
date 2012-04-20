"use strict";

var base = require('./base');
var util = require('../../util');
var valueBucket = require('../valuebucket');
var valueWrapper = require('../valuewrapper');

// Mapping properties to value types
var propertyMapping = {
	'font-family': valueBucket['font-family'].parse,
	'font-size': valueBucket['font-size'].parse,
	'font-style': valueBucket['font-style'].parse,
	'font-weight': valueBucket['font-weight'].parse
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-font"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);
