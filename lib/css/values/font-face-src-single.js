/* <font-face-src-single>
 *
 * CSS2: <url> <font-face-format>? | <font-face-local>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-src-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	var url = bucket['url'].parse(v.unparsed, bucket, v);
	
	if (url) {
		v.debug('parsed url');
		v.add(url);
		v.unparsed = url.unparsed;

		var fff = bucket['font-face-format'].parse(v.unparsed, bucket, v);

		if (fff) {
			v.debug('parsed font-face-format');
			v.add(fff);
			v.unparsed = fff.unparsed;
		}

		v.debug('parse success');
		return v;
	}

	var ffl = bucket['font-face-local'].parse(v.unparsed, bucket, v);

	if (ffl) {
		v.add(ffl);
		v.unparsed = ffl.unparsed;
		v.debug('parse success - font face local');
		return v;
	}

	v.debug('parse fail');
	return null;
};
