/* font-face-font-weight
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  all | <font-face-font-weight-single>#
 * CSS3:  <font-face-font-weight-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontWeight = base.baseConstructor();

util.extend(FontFaceFontWeight.prototype, base.base, {
	name: "font-face-font-weight"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new FontFaceFontWeight(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	if (fffs.handleAll()) {
		return fffs;
	}

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser(bucket['font-face-font-weight-single']);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	fffs.fontValidation(hits);
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};
