/* <font>
 *
 * CSS1:  [<font-style> || <font-variant> || <font-weight>]? <font-size> [/ <line-height>]? <font-family>
 * CSS2:  caption | icon | menu | message-box | small-caption | status-bar | inherit
 * CSS3:  Limits <font-variant> to just <font-variant-css21>
 */

"use strict";

var base = require('./base');
var fontFamily = require('./font-family');
var fontSize = require('./font-size');
var fontStyle = require('./font-style');
var fontVariantCss21 = require('./font-variant-css21');
var fontWeight = require('./font-weight');
var lineHeight = require('./line-height');
var util = require('../../util');
var validate = require('./validate');

var Font = base.baseConstructor();

util.extend(Font.prototype, base.base, {
	name: "background"
});


exports.parse = function (unparsedReal, parser, container) {
	var font = new Font(parser, container, unparsedReal);
	font.debug('parse', unparsedReal);

	if (font.handleInherit()) {
		return font;
	}

	if (font.unparsed.isContent([ 
		'caption',
		'icon',
		'menu',
		'message-box',
		'small-caption',
		'status-bar'
	])) {
		font.add(font.unparsed.advance());
		validate.call(font, 'minimumCss', 2);
		return font;
	}

	var hits = font.unparsed.matchAnyOrder([
		fontStyle,
		fontVariantCss21,
		fontWeight
	], font);

	var fs = fontSize.parse(font.unparsed, parser, font);

	if (! fs) {
		font.debug('parse fail - no font size', font.unparsed);
		return null;
	}

	font.add(fs);
	font.unparsed = fs.unparsed;

	if (font.unparsed.isContent('/')) {
		font.add(font.unparsed.advance());
		var lh = lineHeight.parse(font.unparsed, parser, font);

		if (! lh) {
			font.debug('parse fail - no line height');
			return null;
		}

		font.add(lh);
		font.unparsed = lh.unparsed;
	}

	var ff = fontFamily.parse(font.unparsed, parser, font);

	if (ff) {
		font.add(ff);
		font.unparsed = ff.unparsed;
	}

	font.warnIfInherit();
	font.debug('parse success', font.unparsed);
	return font;
};
