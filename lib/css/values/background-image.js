/* background-image
 *
 * CSS1:  <bg-image>
 * CSS3:  [ <bg-image> , ]* <bg-image>
 */

var base = require('./base');
var bgImage = require('./bg-image');
var util = require('../../util');
var validate = require('./validate');

var BackgroundImage = base.baseConstructor();

util.extend(BackgroundImage.prototype, base.base, {
	name: "background-image"
});


exports.parse = function (unparsedReal, parser, container) {
	var bg = new BackgroundImage(parser, container, unparsedReal);
	bg.debug('parse', unparsedReal);
	bg.repeatParser(bgImage);

	if (bg.list.length < 1) {
		bg.debug('parse fail');
		return null;
	}

	if (bg.list.length > 1) {
		(validate.minimumCss())(3);
		bg.warnIfInherit();
	}

	bg.debug('parse success', bg.unparsed);
	return bg;
};
