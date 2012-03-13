/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percentage = require('./percentage');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl"
});

exports.parse = function (unparsed, parser, container) {
	var hsl = new HSL(parser, container, unparsed);
	hsl.debug('parse', unparsed);

	if (! hsl.functionParser('hsl(', 
		[ number, percentage ],
		[ number, percentage ],
		[ number, percentage ])) {
		return null;
	}

	hsl.warnIfMixingPercents(hsl.list[0], [hsl.list[1], hsl.list[2], hsl[3]]);
	hsl.debug('parse success');
	return hsl;
};
