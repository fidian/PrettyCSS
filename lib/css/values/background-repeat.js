/* background-repeat
 *
 * CSS1:  <repeat-style>
 * CSS3:  [ <repeat-style> , ]* <repeat-style>
 */

var base = require('./base');
var repeatStyle = require('./repeat-style');
var util = require('../../util');
var validate = require('./validate');

var BackgroundRepeat = base.baseConstructor();

util.extend(BackgroundRepeat.prototype, base.base, {
	name: "background-repeat"
});


exports.parse = function (unparsedReal, parser, container) {
	var br = new BackgroundRepeat(parser, container, unparsedReal);
	br.debug('parse', unparsedReal);
	br.repeatParser(repeatStyle);

	if (br.list.length < 1) {
		br.debug('parse fail');
		return null;
	}

	if (br.list.length > 1) {
		(validate.minimumCss())(3);
		br.warnIfInherit();
	}

	br.debug('parse success', br.unparsed);
	return br;
};
