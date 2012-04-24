/* font-face-widths-single
 *
 * Note:  Not in CSS3 and inherit is not allowed
 *
 * CSS2:  <urange>? <number>+
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-widths-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	var e = bucket['urange'].parse(v.unparsed, bucket, v);

	if (e) {
		v.add(e);
		v.unparsed = e.unparsed;
	}

	e = bucket['number'].parse(v.unparsed, bucket, v);

	if (! e) {
		v.debug('parse fail');
		return null;
	}

	while (e) {
		v.add(e);
		v.unparsed = e.unparsed;
		e = bucket['number'].parse(v.unparsed, bucket, v);
	}

	v.debug('parse success', v.unparsed);
	return v;
};
