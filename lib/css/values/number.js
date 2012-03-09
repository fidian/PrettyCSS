/* <number>
 *
 * Numbers can be negative or positive numbers and may be floats.
 */

var base = require('./value-base');
var util = require('../../util');

var Num = base.baseConstructor();

util.extend(Num.prototype, base.base, {
	name: "number",

	allowed: [
		{
			validation: [],
			values: [ 
				base.makeRegexp('[-+]?{n}'),
			]
		}
	],

	getValue: function () {
		return (+ this.list[0]);
	}
});

exports.parse = base.simpleParser(Num);
