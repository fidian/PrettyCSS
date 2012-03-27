/* text-transform
 *
 * CSS1:  capitalize | uppercase | lowercase | none
 * CSS2:  inherit
 * CSS3:  none | [ [ capitalize | uppercase | lowercase ] || full-width || full-size-kana ]
 */

"use strict";

var base = require('./base');
var textTransformCase = require('./text-transform-case');
var util = require('../../util');
var validate = require('./validate');

var TextTransform = base.baseConstructor();

util.extend(TextTransform.prototype, base.base, {
	name: "text-transform"
});


exports.parse = function (unparsedReal, parser, container) {
	var tt = new TextTransform(parser, container, unparsedReal);
	tt.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();

	if (tt.handleInherit()) {
		return tt;
	}

	if (unparsed.isContent('none')) {
		tt.add(unparsed.advance());
		tt.unparsed = unparsed;
		return tt;
	}

	var hits = unparsed.matchAnyOrder([
		textTransformCase,
		"full-width",
		"full-size-kana" ], tt);

	if (! hits) {
		tt.debug('parse fail');
		return null;
	}

	tt.list.forEach(function (token) {
		if (token.content) {
			// Regular token - must be a string
			validate.call(tt, 'minimumCss', 3);
		}
	});
	tt.debug('parse success', tt.unparsed);
	tt.warnIfInherit();
	return tt;
};
