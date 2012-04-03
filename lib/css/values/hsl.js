/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl"
});

exports.parse = function (unparsed, bucket, container) {
	var hsl = new HSL(bucket, container, unparsed);
	hsl.debug('parse', unparsed);

	if (! hsl.functionParser('hsl(', 
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']],
		[ bucket['number'], bucket['percentage ']])) {
		return null;
	}

	hsl.warnIfMixingPercents(hsl.list[0], hsl.list.slice(1, 4));

	// Percents must be positive
	hsl.list.slice(1, 4).forEach(function (token) {
		token.setValue(hsl.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
	});

	hsl.debug('parse success');
	return hsl;
};
