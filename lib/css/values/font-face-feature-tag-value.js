/* <font-face-feature-tag-value>
 *
 * CSS3: <string> [ <integer> | on | off ]?
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-feature-tag-value"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', v.unparsed);

	var e = bucket['string'].parse(v.unparsed, bucket, v);

	if (! e) {
		v.debug('parse fail');
		return null;
	}

	v.add(e);
	v.unparsed = e.unparsed;

	e = v.unparsed.matchAny([ 'on', 'off', bucket['integer'] ], v);
	
	if (e) {
		v.add(e);
		v.unparsed = e.unparsed;
	}

	v.debug('parse success');
	return v;
};
