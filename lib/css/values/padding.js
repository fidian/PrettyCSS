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

	if (padding.handleInherit()) {
		return padding;
	}

	var hits = padding.repeatParser(paddingWidth, 4);

	if (! hits) {
		padding.debug('parse fail - too few widths');
		return null;
	}

	padding.warnIfInherit();
	padding.debug('parse success', padding.unparsed);
	return padding;
};
