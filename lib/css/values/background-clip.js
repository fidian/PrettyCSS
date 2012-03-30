/* background-clip
 *
 * CSS3:  <bg-box>#
 */

"use strict";

var base = require('./base');
var bgBox = require('./bg-box');
var util = require('../../util');
var validate = require('./validate');

var BackgroundClip = base.baseConstructor();

util.extend(BackgroundClip.prototype, base.base, {
	name: "background-clip"
});


exports.parse = function (unparsedReal, parser, container) {
	var ba = new BackgroundClip(parser, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bgBox);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
};
