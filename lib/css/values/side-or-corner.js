/* side-or-corner
 *
 * [ left | right ] || [ top | bottom ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "side-or-corner"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);
	var lr = false;
	var valid = false;

	if (v.unparsed.isContent([ 'left', 'right' ])) {
		lr = true;
		v.add(v.unparsed.advance());
		valid = true;
	}

	if (v.unparsed.isContent([ 'top', 'bottom' ])) {
		v.add(v.unparsed.advance());
		valid = true;
	}

	if (! lr && v.unparsed.isContent([ 'left', 'right' ])) {
		v.add(v.unparsed.advance());
		valid = true;
	}

	if (! valid) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
