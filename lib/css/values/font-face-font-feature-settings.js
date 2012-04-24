/* font-face-font-feature-settings
 *
 * Note:  inherit is not allowed
 *
 * CSS3:  normal | <font-face-feature-tag-value>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-font-feature-settings"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.unparsed.isContent('normal')) {
		v.add(v.unparsed.advance());
		validate.call(v, 'minimumCss', v.firstToken(), 3);
		v.debug('parse success - normal');
		return v;
	}

	v.repeatWithCommas = true;
	var hits = v.repeatParser(bucket['font-face-feature-tag-value']);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	v.debug('parse success - feature tags', v.unparsed);
	return v;
};
