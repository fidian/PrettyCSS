/* <letter-spacing>
 *
 * CSS1:  normal | <length>
 * CSS2:  inherit
 * CSS3:  Changes "normal | <length>" to <spacing-limit>, which may have up to three values and also can handle percentages
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

	if (sl.length() == 1) {
		var css1 = v.unparsed.matchAny(['normal', bucket['length']], v);

		if (css1) {
			v.add(css1);
			v.unparsed = css1.unparsed;
			return v;
		}
	}

	v.add(sl);
	v.unparsed = sl.unparsed;
	validate.call(v, 'minimumCss', v.firstToken(), 3);
	v.warnIfInherit();
	return v;
};
