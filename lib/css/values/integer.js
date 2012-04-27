/* <integer>
 *
 * Integers can be negative or positive whole numbers.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "integer",

	allowed: [
		{
			validation: [
				validate.numberPortionIsInteger()
			],
			values: [ 
				base.makeRegexp('[-+]?[0-9]+')
			]
		}
	],

	getValue: function () {
		return (+ this.firstToken().content);
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString();
	}
});

exports.parse = base.simpleParser(Val);
