/* font-face-unicode-range
 *
 * Note:  inherit is not allowed
 * Note:  all is not allowed
 *
 * CSS2:  <urange>#
 * CSS3:  <urange>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-unicode-range"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new Val(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser(bucket['urange']);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	fffs.fontValidation();
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};
