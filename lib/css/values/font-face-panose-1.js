/* font-face-panose-1
 *
 * Note:  Not in CSS3 and inherit is not allowed
 *
 * CSS2:  <integer>{10}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-panose-1"
});


exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);
	var hits = v.repeatParser(bucket['integer'], 10);

	if (hits != 10) {
		v.debug('parse fail - ' + hits);
		return null;
	}

	validate.call(v, 'minimumCss', v.firstToken(), 2);
	validate.call(v, 'maximumCss', v.firstToken(), 2);
	v.debug('parse success', v.unparsed);
	return v;
};
