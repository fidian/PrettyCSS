/* background-image
 *
 * CSS1:  <bg-image>
 * CSS3:  <bg-image>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundImage = base.baseConstructor();

util.extend(BackgroundImage.prototype, base.base, {
	name: "background-image"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bg = new BackgroundImage(bucket, container, unparsedReal);
	bg.debug('parse', unparsedReal);

	if (bg.handleInherit()) {
		return bg;
	}

	bg.repeatWithCommas = true;
	var hits = bg.repeatParser(bucket['bg-image']);

	if (! hits) {
		bg.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(bg, 'minimumCss', bg.firstToken(), 3);
	}

	bg.warnIfInherit();
	bg.debug('parse success', bg.unparsed);
	return bg;
};
