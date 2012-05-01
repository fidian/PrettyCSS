/* <number-percentage>
 *
 * <number> | <percentage>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "number-percentage",

	allowed: [
		{
			validation: [],
			valueObjects: [ 
				'number',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
