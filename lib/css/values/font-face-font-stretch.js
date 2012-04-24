/* font-face-font-stretch
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  all | <font-face-font-stretch-single>#
 * CSS3:  <font-face-font-stretch-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontStretch = base.baseConstructor();

util.extend(FontFaceFontStretch.prototype, base.base, {
	name: "font-face-font-stretch"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new FontFaceFontStretch(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	if (fffs.handleAll()) {
		return fffs;
	}

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser(bucket['font-face-font-stretch-single']);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	fffs.fontValidation(hits);
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};
