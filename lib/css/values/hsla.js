/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla"
});

exports.parse = function (unparsed, parser, container) {
	var hsla = new HSLA(parser, container, unparsed);
	hsla.debug('parse', unparsed);

	if (! hsla.functionParser('hsla(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ],
		number)) {
		return null;
	}

	// Make sure alpha is 0-1
	hsla.warnIfMixingPercents(hsla.list[0], [hsla.list[1], hsla.list[2], hsla[3]]);
	var alpha = hsla.list[4];
	alpha.content = hsla.warnIfOutsideRange(alpha, 0, 1);
	hsla.debug('parse success');
	return hsla;
};
