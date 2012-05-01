/* <length-percentage>
 *
 * <length> | <percentage>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "length-percentage",

	allowed: [
		{
			validation: [],
			valueObjects: [ 
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
