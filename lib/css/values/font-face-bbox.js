/* font-face-bbox
 *
 * Note:  Not in CSS3 and inherit is not allowed
 *
 * CSS2:  <number>, <number>, <number>, <number
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-bbox"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);
	v.repeatWithCommas = true;

	var hits = v.repeatParser(bucket['number'], 4);

	if (hits != 4) {
		v.debug('parse fail - ' + hits);
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 2);
	validate.call(v, 'maximumCss', v.firstToken(), 2);
	v.debug('parse success', v.unparsed);
	return v;
};
