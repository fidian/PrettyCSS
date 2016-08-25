/* <flex>
 *
 * CSS3:  none | [ <flex-resize> <flex-resize>? || <flex-basis> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Flex = base.baseConstructor();

util.extend(Flex.prototype, base.base, {
	name: "flex"
});

exports.parse = function (unparsedReal, bucket, container) {
	var flex = new Flex(bucket, container, unparsedReal);
	var unparsed = flex.unparsed.clone();
	flex.debug('parse', unparsedReal);

	if (flex.handleInherit(function (obj) {
		validate.call(obj, 'minimumCss', obj.firstToken(), 3);
		validate.call(obj, 'browserUnsupported', obj.firstToken(), 'ie10');
	})) {
		return flex;
	}

	if (unparsed.isContent('none')) {
		flex.add(flex.unparsed.advance());
	} else {
		var hits = unparsed.matchAnyOrder([
			bucket['flex-resize-pair'],
			bucket['flex-basis'],
		], flex);

		if (! hits) {
			flex.debug('parse fail');
			return null;
		}
	}

	validate.call(flex, 'minimumCss', flex.firstToken(), 3);
	validate.call(flex, 'browserUnsupported', flex.firstToken(), 'ie10');

	flex.debug('parse success', flex.unparsed);
	return flex;
};
