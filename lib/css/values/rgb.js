/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb"
});

exports.parse = function (unparsed, bucket, container) {
	var rgb = new RGB(bucket, container, unparsed);
	rgb.debug('parse', unparsed);

	if (! rgb.functionParser('rgb(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ])) {
		return null;
	}

	rgb.validateColorValues();
	rgb.debug('parse success');
	return rgb;
};
