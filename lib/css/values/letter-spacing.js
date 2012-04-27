/* <letter-spacing>
 *
 * CSS1:  normal | <length>
 * CSS2:  inherit
 * CSS3:  Changes "normal | <length>" to <spacing-limit>, which may have up to three values
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "letter-spacing"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	v.debug('parse', unparsedReal);

	if (v.handleInherit()) {
		return v;
	}

	var sl = bucket['spacing-limit'].parse(v.unparsed, bucket, v);

	if (! sl) {
		v.debug('parse fail');
		return null;
	}

	v.add(sl);
	v.unparsed = sl.unparsed;

	if (sl.length() > 1) {
		validate.call(v, 'minimumCss', v.firstToken(), 3);
	}

	v.warnIfInherit();
	return v;
};
