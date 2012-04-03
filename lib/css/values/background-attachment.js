/* background-attachment
 *
 * CSS1:  <bg-attachment>
 * CSS3:  <bg-attachment>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundAttachment = base.baseConstructor();

util.extend(BackgroundAttachment.prototype, base.base, {
	name: "background-attachment"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundAttachment(bucket, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bucket['bg-attachment']);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	if (ba.list.length > 1) {
		validate.call(ba, 'minimumCss', ba.firstToken(), 3);
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
};
