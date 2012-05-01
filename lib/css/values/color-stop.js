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
		v.debug('parse fail');
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
