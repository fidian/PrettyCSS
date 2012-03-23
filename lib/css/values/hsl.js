/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

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

	hsl.warnIfMixingPercents(hsl.list[0], hsl.list.slice(1, 4));

	// Percents must be positive
	hsl.list.slice(1, 4).forEach(function (token) {
		token.setValue(hsl.warnIfOutsideRange(token, 0, 100, token.getValue()));
	});

	hsl.debug('parse success');
	return hsl;
};
