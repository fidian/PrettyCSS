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
	var getColor = function (colorIndex) {
		hsla.add(tokens.firstToken());
		var c = tokens.parseColorNumber(hsla, true);

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
		getColor('h');
		getColor('s');
		getColor('l');
	} catch (e) {
		if (typeof e == "string") {
			hsla.debug(e);
			return null;
		}
		throw e;
	}

	var a = tokens.advance();

	if (a.type != 'UNIT' || ! /^[0-9]*\.[0-9]+$/.test(a.content)) {
		hsla.debug('invalid alpha');
		return null;
	}

	hsla.add(a);
	hsla.a = (+a.content);

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
