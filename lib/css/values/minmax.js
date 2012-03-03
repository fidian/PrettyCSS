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
	var tokens = tokensReal.slice(0);
	minmax.debug('parse', tokens);

	var consumeAndSkipWhitespace = function () {
		tokens.shift();

		if (tokens.length && tokens[0].type == 'S') {
			tokens.shift();
		}
	};

	var parsePQ = function () {
		var result = minmaxPq.parse(tokens, parser, minmax);

		if (! result) {
			return false;
		}

		minmax.add(result.value);
		tokens = result.tokens;
		return true;
	};

	var tryParsing = function () {
		if (! tokens.length || tokens[0].type != 'FUNCTION' || tokens[0].content.toLowerCase() != 'minmax(') {
			return null;
		}

		consumeAndSkipWhitespace(tokens);

		if (! tokens.length || ! parsePQ()) {
			return null;
		}

		if (! tokens || tokens[0].type != 'COMMA') {
			return null;
		}

		consumeAndSkipWhitespace(tokens);

		if (! parsePQ()) {
			return null;
		}

		consumeAndSkipWhitespace(tokens);
		
		if (! tokens || tokens[0].type != 'PAREN_CLOSE') {
			return null;
		}

		consumeAndSkipWhitespace(tokens);

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
