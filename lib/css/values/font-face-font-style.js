/* font-face-font-family
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  all | <font-style>#
 * CSS3:  <font-style>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontStyle = base.baseConstructor();

util.extend(FontFaceFontStyle.prototype, base.base, {
	name: "font-face-font-style"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new FontFaceFontStyle(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	if (fffs.handleAll()) {
		return fffs;
	}

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser([ bucket['font-style'] ]);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	fffs.fontValidation(hits);
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};
