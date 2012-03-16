/* background-position
 *
 * CSS1:  <bg-position>
 * CSS3:  [ <bg-position> , ]* <bg-position>
 */

var base = require('./base');
var bgPosition = require('./bg-position');
var util = require('../../util');
var validate = require('./validate');

var BackgroundPosition = base.baseConstructor();

util.extend(BackgroundPosition.prototype, base.base, {
	name: "background-position"
});


exports.parse = function (unparsedReal, parser, container) {
	var br = new BackgroundPosition(parser, container, unparsedReal);
	br.debug('parse', unparsedReal);
	br.repeatParser(bgPosition);

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
