/* <number>
 *
 * Numbers can be negative or positive numbers and may be floats.
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Num = base.baseConstructor();

util.extend(Num.prototype, base.base, {
	name: "number",

	allowed: [
		{
			validation: [],
			values: [ 
				base.makeRegexp('[-+]?{n}')
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

exports.parse = base.simpleParser(Num);
