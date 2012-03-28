/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var number = require('./number');
var percentage = require('./percentage');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb"
});

exports.parse = function (unparsed, parser, container) {
	var rgb = new RGB(parser, container, unparsed);
	rgb.debug('parse', unparsed);

	if (! rgb.functionParser('rgb(', 
		[ number, percentage ],
		[ number, percentage ],
		[ number, percentage ])) {
		return null;
	}

	rgb.warnIfMixingPercents(rgb.list[0], rgb.list.slice(1, 4));

	// Percents must be positive
	rgb.list.slice(1, 4).forEach(function (token) {
		token.setValue(rgb.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
	});

	rgb.debug('parse success');
	return rgb;
};
