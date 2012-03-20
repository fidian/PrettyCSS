/* background-origin
 *
 * CSS3:  <bg-box>
 */

"use strict";

var base = require('./base');
var bgBox = require('./bg-box');
var util = require('../../util');
var validate = require('./validate');

var BackgroundOrigin = base.baseConstructor();

util.extend(BackgroundOrigin.prototype, base.base, {
	name: "background-origin"
});


exports.parse = function (unparsedReal, parser, container) {
	var ba = new BackgroundOrigin(parser, container, unparsedReal);
	ba.debug('parse', unparsedReal);
	ba.repeatParser(bgBox);

	if (ba.list.length < 1) {
		ba.debug('parse fail');
		return null;
	}

	if (ba.list.length > 1) {
		ba.warnIfInherit();
	}

	ba.debug('parse success', ba.unparsed);
	return ba;
};
