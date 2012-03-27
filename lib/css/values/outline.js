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
	var outline = new Outline(parser, container, unparsedReal);
	var unparsed = outline.unparsed.clone();
	outline.debug('parse', unparsedReal);

	if (outline.handleInherit()) {
		return outline;
	}

	var hits = unparsed.matchAnyOrder([
		outlineWidth,
		outlineStyle,
		outlineColor
	], outline);

	if (! hits) {
		outline.debug('parse fail');
		return null;
	}

	outline.debug('parse success', outline.unparsed);
	outline.warnIfInherit();
	return outline;
};
