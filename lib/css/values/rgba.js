/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./value-base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (tokensReal, parser, container) {
	var rgba = new RGBA(parser, container);
	var tokens = tokensReal.clone();
	rgba.debug('parse', tokens);
	tokens = base.functionParser(tokens, rgba,
		'rgba(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ],
		number);
		
	if (! tokens) {
		return null;
	}

	// Make sure alpha is 0-1
	rgba.warnIfMixingPercents(rgba.list[0], [rgba.list[1], rgba.list[2], rgba[3]]);
	var alpha = rgba.list[4];
	alpha.content = rgba.warnIfOutsideRange(alpha, 0, 1);
	rgba.debug('parse success');

	return {
		tokens: tokens,
		value: rgba
	};
};
