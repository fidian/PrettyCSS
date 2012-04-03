/* background-position
 *
 * CSS1:  <bg-position>
 * CSS3:  <bg-position>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundPosition = base.baseConstructor();

util.extend(BackgroundPosition.prototype, base.base, {
	name: "background-position"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bp = new BackgroundPosition(bucket, container, unparsedReal);
	bp.debug('parse', unparsedReal);

	if (bp.handleInherit()) {
		return bp;
	}

	bp.repeatWithCommas = true;
	var hits = bp.repeatParser(bucket['bg-position']);

	if (! hits) {
		bp.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(bp, 'minimumCss', bp.firstToken(), 3);
	}

	bp.warnIfInherit();
	bp.debug('parse success', bp.unparsed);
	return bp;
};
