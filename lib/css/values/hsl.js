/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./value-base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl"
});

exports.parse = function (tokensReal, parser, container) {
	var hsl = new HSL(parser, container);
	var tokens = tokensReal.clone();
	hsl.debug('parse', tokens);
	tokens = base.functionParser(tokens, hsl,
		'hsl(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ]);
		
	if (! tokens) {
		return null;
	}

	hsla.warnIfMixingPercents(hsl.list[0], [hsl.list[1], hsl.list[2], hsl[3]]);
	hsl.debug('parse success');

	return {
		tokens: tokens,
		value: hsl
	};
};
