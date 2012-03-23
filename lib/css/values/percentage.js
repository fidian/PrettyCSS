/* <percentage>
 *
 * Percentages should be integer values from 0.  CSS1 allows floating
 * point numbers, but CSS2 does not.  Allow reading them, but round to the
 * nearest integer.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Percentage = base.baseConstructor();

util.extend(Percentage.prototype, base.base, {
	name: "percentage",

	allowed: [
		{
			validation: [
				validate.numberPortionIsInteger()
			],
			values: [ 
				base.makeRegexp('[-+]?{n}%')
			]
		}
	],

	getValue: function () {
		var v = this.list[0].content;
		v = v.substr(0, v.length - 2);
		v = Math.round(+ v);
		return v;
	},

	setValue: function (newValue) {
		this.list[0] = newValue;
	},

	toString: function () {
		this.debug('toString');
		return this.getValue() + '%';
	}
});

exports.parse = base.simpleParser(Percentage);