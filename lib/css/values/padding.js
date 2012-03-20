/* padding
 *
 * CSS1:  <padding-width>{1,4}
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var paddingWidth= require('./padding-width');
var template = require('./template');
var util = require('../../util');
var validate = require('./validate');

var Padding = base.baseConstructor();

util.extend(Padding.prototype, base.base, {
	name: "padding"
});


exports.parse = function (unparsedReal, parser, container) {
	var padding = new Padding(parser, container, unparsedReal);
	padding.debug('parse', unparsedReal);
	padding.repeatParser(paddingWidth);

	if (padding.list.length < 1) {
		padding.debug('parse fail - too few widths');
		return null;
	}

	if (padding.list.length > 4) {
		padding.debug('parse fail - too many widths');
		return null;
	}

	if (padding.list.length > 1) {
		padding.warnIfInherit();
	}

	padding.debug('parse success', padding.unparsed);
	return padding;
};
