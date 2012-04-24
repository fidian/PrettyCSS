/* font-face-font-size
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  all | <length>#
 *
 * Not in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-font-size"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new Val(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	if (fffs.handleAll()) {
		return fffs;
	}

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser(bucket['length']);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	validate.call(fffs, 'notForwardCompatible', fffs.firstToken(), 3);
	validate.call(fffs, 'minimumCss', fffs.firstToken(), 2);
	validate.call(fffs, 'maximumCss', fffs.firstToken(), 2);
	fffs.warnIfInherit();
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};
