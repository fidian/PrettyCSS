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
				base.makeRegexp('[-+]?{n}(deg|grad|rad|turn)')
			]
		}
	],

	getUnit: function () {
		var out = this.firstToken().content.replace(/[-+0-9.]/g, '');
		return out;
	},

	// Strip unit
	getValue: function () {
		var out = this.firstToken().content.replace(/[^-+0-9.]/g, '');
		return +out;
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + this.getUnit();
	}
});

exports.parse = base.simpleParser(Angle);
