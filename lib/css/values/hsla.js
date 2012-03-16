/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla"
});

exports.parse = function (unparsed, parser, container) {
	var hsla = new HSLA(parser, container, unparsed);
	hsla.debug('parse', unparsed);

	if (! hsla.functionParser('hsla(', 
		[ number, percentage ],
		[ number, percentage ],
		[ number, percentage ],
		number)) {
		return null;
	}

	hsla.warnIfMixingPercents(hsla.list[0], hsla.list.slice(1, 4));

	// Percents must be positive
	hsla.list.slice(1, 4).forEach(function (token) {
		hsla.warnIfOutsideRange(token, 0, 100, token.getValue());
	});

	// Make sure alpha is 0-1
	var alpha = hsla.list[4];
	alpha.content = hsla.warnIfOutsideRange(alpha, 0, 1);
	hsla.debug('parse success');
	return hsla;
};
