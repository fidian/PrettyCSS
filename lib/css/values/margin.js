/* margin
 *
 * CSS1:  <margin-width>{1,4}
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Margin = base.baseConstructor();

util.extend(Margin.prototype, base.base, {
	name: "margin"
});


exports.parse = function (unparsedReal, bucket, container) {
	var margin = new Margin(bucket, container, unparsedReal);
	margin.debug('parse', unparsedReal);

	if (margin.handleInherit()) {
		return margin;
	}

	var hits = margin.repeatParser(bucket['margin-width'], 4);

	if (! hits) {
		margin.debug('parse fail - too few widths');
		return null;
	}

	margin.warnIfInherit();
	margin.debug('parse success', margin.unparsed);
	return margin;
};
