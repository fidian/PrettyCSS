/* <font>
 *
 * CSS1:  [<font-style> || <font-variant> || <font-weight>]? <font-size> [/ <line-height>]? <font-family>
 * CSS2:  caption | icon | menu | message-box | small-caption | status-bar | inherit
 * CSS3:  Limits <font-variant> to just <font-variant-css21>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Font = base.baseConstructor();

util.extend(Font.prototype, base.base, {
	name: "font"
});


exports.parse = function (unparsedReal, bucket, container) {
	var font = new Font(bucket, container, unparsedReal);
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
		validate.call(font, 'minimumCss', font.firstToken(), 2);
		return font;
	}

	var hits = font.unparsed.matchAnyOrder([
		bucket['font-style'],
		bucket['font-variant-css21'],
		bucket['font-weight']	
	], font);

	var fs = bucket['font-size'].parse(font.unparsed, bucket, font);

	if (! fs) {
		font.debug('parse fail - no font size', font.unparsed);
		return null;
	}

	font.add(fs);
	font.unparsed = fs.unparsed;

	if (font.unparsed.isContent('/')) {
		font.add(font.unparsed.advance());
		var lh = bucket['line-height'].parse(font.unparsed, bucket, font);

		if (! lh) {
			font.debug('parse fail - no line height');
			return null;
		}

		font.add(lh);
		font.unparsed = lh.unparsed;
	}

	var ff = bucket['font-family'].parse(font.unparsed, bucket, font);

	if (ff) {
		font.add(ff);
		font.unparsed = ff.unparsed;
	}

	font.warnIfInherit();
	font.debug('parse success', font.unparsed);
	return font;
};
