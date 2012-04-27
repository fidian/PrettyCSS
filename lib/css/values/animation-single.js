/* <animation-single>
 *
 * CSS3:  <animation-name-single> || <animation-duration-single> || <animation-timing-function-single> || <animation-delay-single> || <animation-iteration-count-single> || <animation-direction-single> || <animation-fill-mode-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	var unparsed = v.unparsed.clone();
	v.debug('parse', unparsedReal);

	var hits = unparsed.matchAnyOrder([
		bucket['animation-name-single'],
		bucket['animation-duration-single'],
		bucket['animation-timing-function-single'],
		bucket['animation-delay-single'],
		bucket['animation-iteration-count-single'],
		bucket['animation-direction-single'],
		bucket['animation-fill-mode-single']
	], v);

	if (! hits) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success', v.unparsed);
	return v;
};
