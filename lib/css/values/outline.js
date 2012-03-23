/* <outline>
 *
 * CSS2: [ <outline-width> || <outline-style> || <outline-color> ] | inherit
 */

"use strict";

var base = require('./base');
var outlineColor = require ('./outline-color');
var outlineStyle = require('./outline-style');
var outlineWidth = require('./outline-width');
var util = require('../../util');
var validate = require('./validate');

var Outline = base.baseConstructor();

util.extend(Outline.prototype, base.base, {
	name: "outline"
});


exports.parse = function (unparsedReal, parser, container) {
	var bs = new Outline(parser, container, unparsedReal);
	var unparsed = bs.unparsed.clone();
	bs.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		bs.add(unparsed.advance());
		bs.unparsed = unparsed;
		validate.call(bs, 'minimumCss', 2);
		return bs;
	}

	var result = unparsed.matchAnyOrder([
		outlineWidth,
		outlineStyle,
		outlineColor
	], bs);

	if (! result.matches.length) {
		bs.debug('parse fail');
		return null;
	}

	result.matches.forEach(function (token) {
		bs.add(token);
	});
	bs.unparsed = result.unparsed;
	bs.debug('parse success', bs.unparsed);
	bs.warnIfInherit();
	return bs;
};
