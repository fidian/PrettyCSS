/* flex-resize-pair
 *
 * Used for matching pairs of <flex-grow> <flex-shrink>? for flex property
 *
 * CSS3:  <flex-resize>{1,2} | inherit | initial | unset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexResizePair = base.baseConstructor();

util.extend(FlexResizePair.prototype, base.base, {
	name: "flex-resize-pair"
});


exports.parse = function (unparsedReal, bucket, container) {
	var flexResizePair = new FlexResizePair(bucket, container, unparsedReal);
	flexResizePair.debug('parse', unparsedReal);

	var hits = flexResizePair.repeatParser(bucket['flex-resize'], 2);

	if (! hits) {
		flexResizePair.debug('parse fail - too few widths');
		return null;
	}

	validate.call(flexResizePair, 'minimumCss', flexResizePair.firstToken(), 3);

	flexResizePair.warnIfInherit();
	flexResizePair.debug('parse success', flexResizePair.unparsed);
	return flexResizePair;
};

