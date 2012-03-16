/* background-attachment
 *
 * CSS1:  <bg-attachment>
 * CSS3:  [ <bg-attachment> , ]* <bg-attachment>
 */

var base = require('./base');
var bgAttachment = require('./bg-attachment');
var util = require('../../util');
var validate = require('./validate');

var BackgroundAttachment = base.baseConstructor();

util.extend(BackgroundAttachment.prototype, base.base, {
	name: "background-attachment"
});


exports.parse = function (unparsedReal, parser, container) {
	var ba = new BackgroundAttachment(parser, container, unparsedReal);
	ba.debug('parse', unparsedReal);
	ba.repeatParser(bgAttachment);

	if (ba.list.length < 1) {
		ba.debug('parse fail');
		return null;
	}

	if (ba.list.length > 1) {
		validate.call(ba, 'minimumCss', 3);
		ba.warnIfInherit();
	}

	ba.debug('parse success', ba.unparsed);
	return ba;
};
