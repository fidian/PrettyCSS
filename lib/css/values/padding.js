/* padding
 *
 * CSS1:  <padding-width>{1,4}
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Padding = base.baseConstructor();

util.extend(Padding.prototype, base.base, {
	name: "padding"
});


exports.parse = function (unparsedReal, bucket, container) {
	var padding = new Padding(bucket, container, unparsedReal);
	padding.debug('parse', unparsedReal);

	if (padding.handleInherit()) {
		return padding;
	}

	var hits = padding.repeatParser(bucket['padding-width'], 4);

	if (! hits) {
		padding.debug('parse fail - too few widths');
		return null;
	}

	padding.warnIfInherit();
	padding.debug('parse success', padding.unparsed);
	return padding;
};
