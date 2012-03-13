/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percentage = require('./percentage');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (unparsed, parser, container) {
	var rgba = new RGBA(parser, container, unparsed);
	rgba.debug('parse', unparsed);
	
	if (! rgba.functionParser('rgba(', 
		[ number, percentage ],
		[ number, percentage ],
		[ number, percentage ],
		number)) {
		return null;
	}

	// Make sure alpha is 0-1
	rgba.warnIfMixingPercents(rgba.list[0], [rgba.list[1], rgba.list[2], rgba[3]]);
	var alpha = rgba.list[4];
	alpha.content = rgba.warnIfOutsideRange(alpha, 0, 1);
	rgba.debug('parse success');
	return rgba;
};
