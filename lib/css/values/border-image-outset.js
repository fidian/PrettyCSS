/* border-image-outset
 *
 * CSS3:  <border-image-outset-single>{1,4}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "border-image-outset"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.handleInherit(function () {})) {
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		return v;
	}

	var hits = v.repeatParser(bucket['border-image-outset-single'], 4);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	v.warnIfInherit();
	v.debug('parse success', v.unparsed);
	return v;
};
