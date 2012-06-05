/* <animation-iteration-count-single>
 *
 * CSS3:  infinite | <number>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "animation-iteration-count-single",

	allowed: [
		{
			validation: [],
			values: [
				"infinite"
			]
		},
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
