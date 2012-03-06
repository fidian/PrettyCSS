/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./value-base');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl",

	toString: function () {
		var c = this.parser.options.functionComma;
		var out = 'hsl(' + this.h + c + this.s + c + this.l + ')';
		return out;
	}
});

exports.parse = function (tokensReal, parser, container) {
	var hsl = new HSL(parser, container);
	var tokens = tokensReal.clone();
	hsl.debug('parse', tokens);
	
	var getColor = function (colorIndex, parseMethod, eatComma) {
		hsl.add(tokens.firstToken());
		var c = tokens[parseMethod](hsl, eatComma);

		if (c == null) {
			return null;
		}

		hsl[colorIndex] = c;
	}

	if (! tokens.isTypeContent('FUNCTION', 'hsl(')) {
		hsl.debug('not hsl function');
		return null;
	}

	hsl.add(tokens.advance());

	try {
		getColor('h', 'parseAngle', true);
		getColor('s', 'parseColorNumber', true);
		getColor('l', 'parseColorNumber', false);
	} catch (e) {
		if (typeof e == "string") {
			hsl.debug(e);
			return null;
		}
		throw e;
	}

	if (! tokens.isType('PAREN_CLOSE')) {
		hsl.debug('no close paren');
		return null;
	}

	tokens.advance();
	base.warnIfMixingPercents(hsl, hsl.list[0], [hsl.r, hsl.g, hsl.b]);
	hsl.debug('parse success');

	return {
		tokens: tokens,
		value: hsl
	};
};
