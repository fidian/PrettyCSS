/* <quotes-single>
 *
 * CSS2:  <string> <string>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "quotes-single"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse start');
	
	var hits = v.repeatParser([ bucket['string'] ], 2);

	if (hits != 2) {
		v.debug('parse fail');
		return null;
	}

	return v;
};
