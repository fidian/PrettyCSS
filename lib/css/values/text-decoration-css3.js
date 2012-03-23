/* <text-decoration-css3>
 *
 * CSS3:  <text-decoration-line> || <text-decoration-style> || <text-decoration-color> || blink
 */

"use strict";

var base = require('./base');
var textDecorationBlink = require('./text-decoration-blink');
var textDecorationColor = require('./text-decoration-color');
var textDecorationLine = require('./text-decoration-line');
var textDecorationStyle = require('./text-decoration-style');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss3 = base.baseConstructor();

util.extend(TextDecorationCss3.prototype, base.base, {
	name: "text-decoration-css3"
});

exports.parse = function (unparsedReal, parser, container) {
	var tdc3 = new TextDecorationCss3(parser, container, unparsedReal);
	var unparsed = tdc3.unparsed.clone();
	tdc3.debug('parse', unparsedReal);
	validate.call(tdc3, 'minimumCss', 3);

	var result = unparsed.matchAnyOrder([
		textDecorationLine,
		textDecorationStyle,
		textDecorationColor,
		textDecorationBlink
	], tdc3);

	if (! result.matches.length) {
		return null;
	}

	result.matches.forEach(function (token) {
		tdc3.add(token);
	});
	tdc3.unparsed = result.unparsed;
	return tdc3;
};
