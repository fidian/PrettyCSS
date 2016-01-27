/* hsl( {w} {n} {w} , {w} {n} %? {w} , {w} {n} %? {w} )
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
		bucket['number'],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ])) {
		return null;
	}

	hsl.validateColorValues(true);
	hsl.debug('parse success');
	return hsl;
};
