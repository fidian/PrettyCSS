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

	if (bs.handleInherit()) {
		return bs;
	}

	var hits = unparsed.matchAnyOrder([
		borderWidthSingle,
		borderStyle,
		borderColorSingle
	], bs);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.debug('parse success', bs.unparsed);
	bs.warnIfInherit();
	return bs;
};
