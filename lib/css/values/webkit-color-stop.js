/* <webkit-color-stop>
 *
 * color-stop(<number>|<percentage>, <color>)
 * from(<color>) -- same as color-stop(0, <color>)
 * to(<color>) -- same as color-stop(1, <color>)
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-color-stop"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.functionParser('color-stop(',
		[ bucket['number'], bucket['percentage'] ],
		bucket['color'])) {
		if (! v.functionParser('from(', bucket['color'])) {
			if (! v.functionParser('to(', bucket['color'])) {
				v.debug('parse fail');
				return null;
			}
		}
	}

	v.debug('parse success');
	return v;
};
