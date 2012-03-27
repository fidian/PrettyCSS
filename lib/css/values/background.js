/* background
 *
 * CSS1:  <bg-layer>
 * CSS3:  <bg-layer> [ , <bg-layer> ]* (only the last can have background-color)
 */

"use strict";

var base = require('./base');
var bgLayer = require('./bg-layer');
var util = require('../../util');
var validate = require('./validate');

var Background = base.baseConstructor();

util.extend(Background.prototype, base.base, {
	name: "background"
});


exports.parse = function (unparsedReal, parser, container) {
	var b = new Background(parser, container, unparsedReal);
	b.debug('parse', unparsedReal);

	if (b.handleInherit()) {
		return b;
	}

	var hits = b.repeatParser(bgLayer);

	if (! hits) {
		b.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		var scanList = b.list.slice(0);
		scanList.pop();
		scanList.forEach(function (e) {
			if (!! e.mustBeFinal) {
				b.addWarning('illegal_value', e.firstToken());
			}
		});
	}

	b.warnIfInherit();
	b.debug('parse success', b.unparsed);
	return b;
};
