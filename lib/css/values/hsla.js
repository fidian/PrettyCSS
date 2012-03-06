/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./value-base');
var util = require('../../util');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla",

	toString: function () {
		var c = this.parser.options.functionComma;
		var out = 'hsla(' + this.h + c + this.s + c + this.l + c + this.a + ')';
		return out;
	}
});

exports.parse = function (tokensReal, parser, container) {
	var hsla = new HSLA(parser, container);
	var tokens = tokensReal.clone();
	hsla.debug('parse', tokens);

	var getColor = function (colorIndex, parseMethod) {
		hsla.add(tokens.firstToken());
		var c = tokens[parseMethod](hsla, true);

		if (c == null) {
			return null;
		}

		hsla[colorIndex] = c;
	}

	if (! tokens.isTypeContent('FUNCTION', 'hsla(')) {
		hsla.debug('not hsla function');
		return null;
	}

	hsla.add(tokens.advance());

	try {
		getColor('h', 'parseAngle');
		getColor('s', 'parseColorNumber');
		getColor('l', 'parseColorNumber');
		getColor('a', 'parseAlpha');
	} catch (e) {
		if (typeof e == "string") {
			hsla.debug(e);
			return null;
		}
		throw e;
	}

	if (! tokens.isType('PAREN_CLOSE')) {
		hsla.debug('no close paren');
		return null;
	}

	tokens.advance();
	base.warnIfMixingPercents(hsla, hsla.list[0], [hsla.r, hsla.g, hsla.b]);
	hsla.debug('parse success');

	return {
		tokens: tokens,
		value: hsla
	};
};
