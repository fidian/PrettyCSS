/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla"
});

exports.parse = function (unparsed, bucket, container) {
	var hsla = new HSLA(bucket, container, unparsed);
	hsla.debug('parse', unparsed);

	if (! hsla.functionParser('hsla(', 
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']],
		bucket['number'])) {
		return null;
	}

	hsla.warnIfMixingPercents(hsla.list[0], hsla.list.slice(1, 4));

	// Percents must be positive
	hsla.list.slice(1, 4).forEach(function (token) {
		token.setValue(hsla.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
	});

	// Make sure alpha is 0-1
	var alpha = hsla.list[4];
	alpha.content = hsla.warnIfOutsideRange(alpha, 0, 1);
	hsla.debug('parse success');
	return hsla;
};
