/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./value-base');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb",

	toString: function () {
		var c = this.parser.options.functionComma;
		var out = 'rgb(' + this.r + c + this.g + c + this.b + ')';
		return out;
	}
});

exports.parse = function (tokensReal, parser, container) {
	var rgb = new RGB(parser, container);
	var tokens = tokensReal.clone();
	rgb.debug('parse', tokens);
	var getColor = function (colorIndex, eatComma) {
		rgb.add(tokens.firstToken());
		var c = tokens.parseColorNumber(rgb, eatComma);

		if (c == null) {
			return null;
		}

		rgb[colorIndex] = c;
	}

	if (! tokens.isTypeContent('FUNCTION', 'rgb(')) {
		rgb.debug('not rgb function');
		return null;
	}

	rgb.add(tokens.advance());

	try {
		getColor('r', true);
		getColor('g', true);
		getColor('b', false);
	} catch (e) {
		if (typeof e == "string") {
			rgb.debug(e);
			return null;
		}
		throw e;
	}

	if (! tokens.isType('PAREN_CLOSE')) {
		rgb.debug('no close paren');
		return null;
	}

	tokens.advance();
	base.warnIfMixingPercents(rgb, rgb.list[0], [rgb.r, rgb.g, rgb.b]);
	rgb.debug('parse success');

	return {
		tokens: tokens,
		value: rgb
	};
};
