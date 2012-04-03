/* border-width
 *
 * CSS1:  <border-width-single>{1,4}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderWidth = base.baseConstructor();

util.extend(BorderWidth.prototype, base.base, {
	name: "border-width"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bw = new BorderWidth(bucket, container, unparsedReal);
	bw.debug('parse', unparsedReal);

	if (bw.handleInherit()) {
		return bw;
	}

	var hits = bw.repeatParser(bucket['border-width-single'], 4);

	if (! hits) {
		bw.debug('parse fail');
		return null;
	}

	bw.warnIfInherit();
	bw.debug('parse success', bw.unparsed);
	return bw;
};
