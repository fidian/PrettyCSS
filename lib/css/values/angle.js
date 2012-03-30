/* <angle>
 *
 * Angles can be [ 0 - 360 ) (zero inclusive through 360 non-inclusive).
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Angle = base.baseConstructor();

util.extend(Angle.prototype, base.base, {
	name: "angle",

	allowed: [
		{
			validation: [
				validate.angle()
			],
			values: [ 
				"0",
				base.makeRegexp('[-+]?{n}')
			]
		}
	],

	getValue: function () {
		return +(this.firstToken().content);
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString();
	}
});

exports.parse = base.simpleParser(Angle);
