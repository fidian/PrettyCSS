/* background-position-single
 *
 * CSS1:  left | center | right | <length> | <percentage>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var BackgroundPositionSingle = base.baseConstructor();

util.extend(BackgroundPositionSingle.prototype, base.base, {
	name: "background-position-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bp = new BackgroundPositionSingle(bucket, container, unparsedReal);
	bp.debug('parse', unparsedReal);

	if (bp.handleInherit()) {
		return bp;
	}

	bp.repeatWithCommas = true;
	var hits = bp.repeatParser(bucket['bg-position-single']);

	if (! hits) {
		bp.debug('parse fail');
		return null;
	}

	bp.warnIfInherit();
	bp.debug('parse success', bp.unparsed);
	return bp;
};
