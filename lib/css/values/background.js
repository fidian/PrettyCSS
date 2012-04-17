/* background
 *
 * CSS1:  <bg-layer>
 * CSS3:  <bg-layer>#  (only the last can have background-color)
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Background = base.baseConstructor();

util.extend(Background.prototype, base.base, {
	name: "background"
});


exports.parse = function (unparsedReal, bucket, container) {
	var b = new Background(bucket, container, unparsedReal);
	b.debug('parse', unparsedReal);

	if (b.handleInherit()) {
		return b;
	}

	b.repeatWithCommas = true;
	var hits = b.repeatParser(bucket['bg-layer']);

	if (! hits) {
		b.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		var scanList = b.list.slice(0);
		scanList.pop();
		scanList.forEach(function (e) {
			if (!! e.mustBeFinal) {
				b.addWarning('illegal', e.firstToken());
			}
		});
	}

	b.warnIfInherit();
	b.debug('parse success', b.unparsed);
	return b;
};
