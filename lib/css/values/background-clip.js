/* background-clip
 *
 * CSS3:  <bg-box>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundClip = base.baseConstructor();

util.extend(BackgroundClip.prototype, base.base, {
	name: "background-clip"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundClip(bucket, container, unparsedReal);
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
	validate.call(ba, 'browserUnsupported', ba.firstToken(), 'ie7');
	validate.call(ba, 'browserUnsupported', ba.firstToken(), 'ie8');
	ba.debug('parse success', ba.unparsed);
	return ba;
};
