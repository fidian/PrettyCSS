/* <angle>
 *
 * Angles can be [ 0 - 360 ) (zero inclusive through 360 non-inclusive).
 */

var base = require('./value-base');
var util = require('../../util');
var validate = require('./value-validate');

var Angle = base.baseConstructor();

util.extend(Angle.prototype, base.base, {
	name: "angle",

	allowed: [
		{
			validation: [],
			values: [ 
				"0",
				base.makeRegexp('[-+]?{n}'),
			]
		}
	]
});

exports.parse = base.simpleParser(Angle);
