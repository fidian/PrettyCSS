/* background-origin
 *
 * CSS3:  <bg-box>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundOrigin = base.baseConstructor();

util.extend(BackgroundOrigin.prototype, base.base, {
	name: "background-origin"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundOrigin(bucket, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bucket['bg-box']);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
};
