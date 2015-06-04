/* border-style-multiple
 *
 * CSS:  <border-style-single>{1,4}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyleMultiple = base.baseConstructor();

util.extend(BorderStyleMultiple.prototype, base.base, {
	name: "border-style-multiple"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bsm = new BorderStyleMultiple(bucket, container, unparsedReal);
	bsm.debug('parse', unparsedReal);

	var hits = bsm.repeatParser(bucket['border-style-single'], 4);

	if (! hits) {
		bsm.debug('parse fail');
		return null;
	}

	bsm.debug('parse success', bsm.unparsed);
	return bsm;
};
