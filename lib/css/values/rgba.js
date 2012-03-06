/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./value-base');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba",

	toString: function () {
		var c = this.parser.options.functionComma;
		var out = 'rgba(' + this.r + c + this.g + c + this.b + c + this.a + ')';
		return out;
	}
});

exports.parse = function (tokensReal, parser, container) {
	var rgba = new RGBA(parser, container);
	var tokens = tokensReal.clone();
	rgba.debug('parse', tokens);
	var getColor = function (colorIndex) {
		rgba.add(tokens.firstToken());
		var c = tokens.parseColorNumber(rgba, true);

		if (c == null) {
			return null;
		}

		rgba[colorIndex] = c;
	}

	if (! tokens.isTypeContent('FUNCTION', 'rgba(')) {
		rgba.debug('not rgba function');
		return null;
	}

	rgba.add(tokens.advance());

	try {
		getColor('r');
		getColor('g');
		getColor('b');
	} catch (e) {
		if (typeof e == "string") {
			rgba.debug(e);
			return null;
		}
		throw e;
	}

	var a = tokens.advance();

	if (a.type != 'UNIT' || ! /^[0-9]*\.[0-9]+$/.test(a.content)) {
		rgba.debug('invalid alpha');
		return null;
	}

	rgba.add(a);
	rgba.a = (+a.content);

	if (! tokens.isType('PAREN_CLOSE')) {
		rgba.debug('no close paren');
		return null;
	}

	tokens.advance();
	base.warnIfMixingPercents(rgba, rgba.list[0], [rgba.r, rgba.g, rgba.b]);
	rgba.debug('parse success');

	return {
		tokens: tokens,
		value: rgba
	};
};
