/* to-side-or-corner
 *
 * CSS3:  to <side-or-corner>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "to-side-or-corner"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	if (! v.unparsed.isContent('to')) {
		v.debug('parse fail - to');
		return null;
	}

	v.add(v.unparsed.advance());

	var elem = bucket['side-or-corner'].parse(v.unparsed, bucket, v);

	if (! elem) {
		v.debug('parse fail - side-or-corner');
		return null;
	}

	v.add(elem);
	v.unparsed = elem.unparsed;
	v.debug('parse success');
	return v;
};
