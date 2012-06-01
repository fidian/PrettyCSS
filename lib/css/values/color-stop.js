/* <color-stop>
 *
 * CSS3:  <color> <length-percentage>?
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "color-stop"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse start');

	var e = bucket['color'].parse(v.unparsed, bucket, v);

	if (! e) {
		v.debug('parse fail - no color');
		return null;
	}

	// Inherit does not make sense for a color stop
	if (e.isInherit()) {
		v.debug('parse fail - inherit');
		return null;
	}

	v.add(e);
	v.unparsed = e.unparsed;

	e = bucket['length-percentage'].parse(v.unparsed, bucket, v);

	if (e) {
		v.add(e);
		v.unparsed = e.unparsed;
	}

	v.debug('parse success');
	return v;
};
