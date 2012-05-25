/* <length-percentage2>
 *
 * CSS2:  <length-percentage> <length-percentage>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "length-percentage2"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	var hits = v.repeatParser([ bucket['length-percentage'] ], 2);

	if (hits < 2) {
		v.debug('parse fail');
		return null;
	}

	v.debug('parse success');
	return v;
};
