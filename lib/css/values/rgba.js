/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (unparsed, bucket, container) {
	var rgba = new RGBA(bucket, container, unparsed);
	rgba.debug('parse', unparsed);
	
	if (! rgba.functionParser('rgba(', 
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']],
		bucket['number'])) {
		return null;
	}

	rgba.warnIfMixingPercents(rgba.list[0], rgba.list.slice(1, 4));

	// Percents must be positive
	rgba.list.slice(1, 4).forEach(function (token) {
		token.setValue(rgba.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
	});

	// Make sure alpha is 0-1
	var alpha = rgba.list[4];
	alpha.content = rgba.warnIfOutsideRange(alpha, 0, 1);
	rgba.debug('parse success');
	return rgba;
};
