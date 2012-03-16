/* background-clip
 *
 * CSS3:  <bg-box>
 */

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
