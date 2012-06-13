/* <urange>
 *
 * Basic data type used in simple parsers
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "urange"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);
	v.preserveCase = true;

	if (v.unparsed.isType('UNICODE_RANGE')) {
		v.add(v.unparsed.advance());
		return v;
	}

	return null;
};
