/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./value-base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb"
});

exports.parse = function (tokensReal, parser, container) {
	var rgb = new RGB(parser, container);
	var tokens = tokensReal.clone();
	rgb.debug('parse', tokens);
	tokens = base.functionParser(tokens, rgb,
		'rgb(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ]);
	
	if (! tokens) {
		return null;
	}

	rgb.warnIfMixingPercents(rgb.list[0], [rgb.list[1], rgb.list[2], rgb[3]]);
	rgb.debug('parse success');

	return {
		tokens: tokens,
		value: rgb
	};
};
