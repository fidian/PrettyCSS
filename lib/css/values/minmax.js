/* <minmax>
 *
 * Used by <col-width>
 * minmax( WS? p WS? , WS? q WS? )
 */

var base = require('./value-base');
var minmaxPq = require('./minmax-pq');
var util = require('../../util');

var Minmax = base.baseConstructor();

util.extend(Minmax.prototype, base.base, {
	name: "minmax",
});


exports.parse = function (tokensReal, parser, container) {
	var minmax = new Minmax(parser, container);
	var tokens = tokensReal.clone();
	minmax.debug('parse', tokens);

	var parsePQ = function () {
		if (! tokens.length()) {
			return false;
		}

		var result = minmaxPq.parse(tokens, parser, minmax);

		if (! result) {
			return false;
		}

		minmax.add(result.value);
		tokens = result.tokens;

		if (tokens.isType("S")) {
			tokens.shift();
		}

		return true;
	};

	var tryParsing = function () {
		if (! tokens.isTypeContent('FUNCTION', 'minmax(')) {
			return null;
		}

		tokens.advance();

		if (! parsePQ()) {
			return null;
		}

		if (! tokens.isType('COMMA')) {
			return null;
		}

		tokens.advance();

		if (! parsePQ()) {
			return null;
		}

		if (! tokens.isType('PAREN_CLOSE')) {
			return null;
		}

		tokens.advance();

		return {
			tokens: tokens,
			value: minmax
		};
	};
	var result = tryParsing();

	// TODO:  If P > Q then assume minmax(P,P) - add warning
	if (! result) {
		minmax.debug('parse fail');
	} else {
		minmax.debug('parse success', result.tokens);
	}

	return result;
};
