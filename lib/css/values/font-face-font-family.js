/* font-face-font-family
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  <font-family-single>#
 * CSS3:  <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontFamily = base.baseConstructor();

util.extend(FontFaceFontFamily.prototype, base.base, {
	name: "font-face-font-family"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ffff = new FontFaceFontFamily(bucket, container, unparsedReal);
	ffff.debug('parse', unparsedReal);
	ffff.repeatWithCommas = true;
	var hits = ffff.repeatParser(bucket['font-family-single']);

	if (! hits) {
		ffff.debug('parse fail');
		return null;
	}

	ffff.fontValidation(hits);
	ffff.debug('parse success', ffff.unparsed);
	return ffff;
};
