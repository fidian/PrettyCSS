/* <webkit-text-stroke>
 *
 * CSS3:  <webkit-text-stroke-width> <webkit-text-stroke-color>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-text-stroke"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.handleInherit()) {
		return v;
	}

	var w = bucket['webkit-text-stroke-width'].parse(v.unparsed, bucket, v);

	if (! w) {
		v.debug('parse fail - no width', v.unparsed);
		return null;
	}

	v.add(w);
	v.unparsed = w.unparsed;
	var c = bucket['webkit-text-stroke-color'].parse(v.unparsed, bucket, v);
	
	if (! c) {
		v.debug('parse fail - no color', v.unparsed);
		return null;
	}

	v.add(c);
	v.unparsed = c.unparsed;
	v.warnIfInherit();
	v.debug('parse success', v.unparsed);
	return v;
};
