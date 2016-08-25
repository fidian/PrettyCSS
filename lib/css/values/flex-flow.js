/* <flex-flow>
 *
 * CSS3:  <flex-direction> || <flex-wrap>
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FlexFlow = base.baseConstructor();

util.extend(FlexFlow.prototype, base.base, {
	name: "flex-flow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var flexFlow = new FlexFlow(bucket, container, unparsedReal);
	var unparsed = flexFlow.unparsed.clone();
	flexFlow.debug('parse', unparsedReal);

	if (flexFlow.handleInherit(function (obj) {
		validate.call(obj, 'minimumCss', obj.firstToken(), 3);
		validate.call(obj, 'browserUnsupported', obj.firstToken(), 'ie10');
	})) {
		return flexFlow;
	}

	var hits = unparsed.matchAnyOrder([
		bucket['flex-direction'],
		bucket['flex-wrap'],
	], flexFlow);

	if (! hits) {
		flexFlow.debug('parse fail');
		return null;
	}

	validate.call(flexFlow, 'minimumCss', flexFlow.firstToken(), 3);
	validate.call(flexFlow, 'browserUnsupported', flexFlow.firstToken(), 'ie10');

	flexFlow.debug('parse success', flexFlow.unparsed);
	return flexFlow;
};

