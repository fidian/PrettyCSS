/* background-repeat
 *
 * CSS1:  <bg-repeat>
 * CSS3:  [ <bg-repeat> , ]* <bg-repeat>
 */

"use strict";

var base = require('./base');
var bgRepeat = require('./bg-repeat');
var util = require('../../util');
var validate = require('./validate');

var BackgroundRepeat = base.baseConstructor();

util.extend(BackgroundRepeat.prototype, base.base, {
	name: "background-repeat"
});


exports.parse = function (unparsedReal, parser, container) {
	var br = new BackgroundRepeat(parser, container, unparsedReal);
	br.debug('parse', unparsedReal);
	br.repeatParser(bgRepeat);

	if (br.list.length < 1) {
		br.debug('parse fail');
		return null;
	}

	if (br.list.length > 1) {
		validate.call(br, 'minimumCss', 3);
		br.warnIfInherit();
	}

	br.debug('parse success', br.unparsed);
	return br;
};
