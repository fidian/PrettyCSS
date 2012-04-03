/* background-repeat
 *
 * CSS1:  <bg-repeat>
 * CSS3:  <bg-repeat>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundRepeat = base.baseConstructor();

util.extend(BackgroundRepeat.prototype, base.base, {
	name: "background-repeat"
});


exports.parse = function (unparsedReal, bucket, container) {
	var br = new BackgroundRepeat(bucket, container, unparsedReal);
	br.debug('parse', unparsedReal);

	if (br.handleInherit()) {
		return br;
	}

	br.repeatWithCommas = true;
	var hits = br.repeatParser(bucket['bg-repeat']);

	if (! hits) {
		br.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(br, 'minimumCss', br.firstToken(), 3);
	}

	br.warnIfInherit();
	br.debug('parse success', br.unparsed);
	return br;
};
