/* <ms-color-stop>
 *
 * CSS3:  <color> <number-percentage>?
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "ms-color-stop"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse start');

	var e = bucket['color'].parse(v.unparsed, bucket, v);

	if (! e || e.isInherit()) {
		v.debug('parse fail');
		return null;
	}

	v.add(e);
	v.unparsed = e.unparsed;

	e = bucket['number-percentage'].parse(v.unparsed, bucket, v);

	if (e && ! e.isInherit()) {
		v.add(e);
		v.unparsed = e.unparsed;
	}

	v.debug('parse success');
	return v;
};
