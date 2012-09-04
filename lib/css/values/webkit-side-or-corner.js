/* webkit-side-or-corner
 *
 * [ left | right ] [ top | bottom ] ? | [ top | bottom ]
 *
 * TODO:  Autocorrect if this is reversed
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-side-or-corner"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v, valid;

	v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	valid = false;

	if (v.unparsed.isContent([ 'left', 'right' ])) {
		v.add(v.unparsed.advance());
		valid = true;
	}

	if (v.unparsed.isContent([ 'top', 'bottom' ])) {
		v.add(v.unparsed.advance());
		valid = true;
	}

	if (!valid) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
