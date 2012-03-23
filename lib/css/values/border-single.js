/* <border-single>
 *
 * CSS1:  <border-width-single> || <border-style> || <border-color-single>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var borderColorSingle = require('./border-color-single');
var borderStyle = require('./border-style');
var borderWidthSingle = require('./border-width-single');
var util = require('../../util');
var validate = require('./validate');

var BorderSingle = base.baseConstructor();

util.extend(BorderSingle.prototype, base.base, {
	name: "border-single"
});


exports.parse = function (unparsedReal, parser, container) {
	var bs = new BorderSingle(parser, container, unparsedReal);
	var unparsed = bs.unparsed.clone();
	bs.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		bs.add(unparsed.advance());
		bs.unparsed = unparsed;
		validate.call(bs, 'minimumCss', 2);
		return bs;
	}

	var result = unparsed.matchAnyOrder([
		borderWidthSingle,
		borderStyle,
		borderColorSingle
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
