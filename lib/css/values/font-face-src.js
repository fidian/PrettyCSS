/* font-face-src
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  <font-face-src-single>#
 * CSS3:  <font-face-src-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-src"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);
	v.repeatWithCommas = true;
	var hits = v.repeatParser(bucket['font-face-src-single']);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	v.fontValidation();
	v.debug('parse success', v.unparsed);
	return v;
};
