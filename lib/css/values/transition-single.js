/* <transition-single>
 *
 * CSS3:  <transition-property-single> || <transition-duration-single> || <transition-timing-function-single> || <transition-delay-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transition-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	var unparsed = v.unparsed.clone();
	v.debug('parse', unparsedReal);

	var hits = unparsed.matchAnyOrder([
		bucket['transition-duration-single'],
		bucket['transition-timing-function-single'],
		bucket['transition-delay-single'],
		bucket['transition-property-single']  // Keep this one last - it matches IDENT
	], v);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success', v.unparsed);
	return v;
};
