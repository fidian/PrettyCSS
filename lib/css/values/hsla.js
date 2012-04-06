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
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		bucket['number'])) {
		return null;
	}

	hsla.validateColorValues();
	hsla.debug('parse success');
	return hsla;
};
