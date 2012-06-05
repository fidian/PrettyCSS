/* border-image-width
 *
 * CSS3:  <border-image-width-single>{1,4}
 *
 * The CSS3 warning is added by border-image-width-single.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-width"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.handleInherit(function () {})) {
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	var hits = v.repeatParser(bucket['border-image-width-single'], 4);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	v.warnIfInherit();
	v.debug('parse success', v.unparsed);
	return v;
};
